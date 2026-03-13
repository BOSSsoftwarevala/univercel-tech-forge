
-- Google Classroom Clone - Core Tables

-- 1. Classrooms
CREATE TABLE public.gc_classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  section TEXT,
  subject TEXT,
  room TEXT,
  description TEXT,
  class_code TEXT UNIQUE DEFAULT substring(md5(random()::text), 1, 6),
  cover_color TEXT DEFAULT '#1967d2',
  owner_id UUID NOT NULL,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Class Members (students & teachers)
CREATE TABLE public.gc_class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES public.gc_classrooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'co_teacher')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(classroom_id, user_id)
);

-- 3. Assignments
CREATE TABLE public.gc_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES public.gc_classrooms(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assignment_type TEXT DEFAULT 'assignment' CHECK (assignment_type IN ('assignment', 'quiz', 'material', 'question')),
  max_points INTEGER DEFAULT 100,
  due_date TIMESTAMPTZ,
  topic TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled')),
  created_by UUID NOT NULL,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Submissions
CREATE TABLE public.gc_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.gc_assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID NOT NULL,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'turned_in', 'returned', 'reclaimed')),
  grade INTEGER,
  feedback TEXT,
  submission_text TEXT,
  attachments JSONB DEFAULT '[]',
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  graded_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(assignment_id, student_id)
);

-- 5. Announcements / Stream
CREATE TABLE public.gc_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classroom_id UUID REFERENCES public.gc_classrooms(id) ON DELETE CASCADE NOT NULL,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Comments (on assignments/announcements)
CREATE TABLE public.gc_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_type TEXT NOT NULL CHECK (parent_type IN ('assignment', 'announcement', 'submission')),
  parent_id UUID NOT NULL,
  author_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_gc_class_members_classroom ON public.gc_class_members(classroom_id);
CREATE INDEX idx_gc_class_members_user ON public.gc_class_members(user_id);
CREATE INDEX idx_gc_assignments_classroom ON public.gc_assignments(classroom_id);
CREATE INDEX idx_gc_submissions_assignment ON public.gc_submissions(assignment_id);
CREATE INDEX idx_gc_submissions_student ON public.gc_submissions(student_id);
CREATE INDEX idx_gc_announcements_classroom ON public.gc_announcements(classroom_id);
CREATE INDEX idx_gc_comments_parent ON public.gc_comments(parent_type, parent_id);

-- Enable RLS on all tables
ALTER TABLE public.gc_classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gc_class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gc_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gc_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gc_comments ENABLE ROW LEVEL SECURITY;

-- RLS: Authenticated users can read classrooms they belong to or own
CREATE POLICY "Users can view own classrooms" ON public.gc_classrooms
  FOR SELECT TO authenticated
  USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.gc_class_members WHERE classroom_id = id AND user_id = auth.uid()
  ));

CREATE POLICY "Owners can manage classrooms" ON public.gc_classrooms
  FOR ALL TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Class members: visible to class participants
CREATE POLICY "Class members visible to participants" ON public.gc_class_members
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.gc_class_members cm WHERE cm.classroom_id = gc_class_members.classroom_id AND cm.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.gc_classrooms c WHERE c.id = gc_class_members.classroom_id AND c.owner_id = auth.uid()
  ));

CREATE POLICY "Teachers can manage members" ON public.gc_class_members
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.gc_classrooms c WHERE c.id = gc_class_members.classroom_id AND c.owner_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.gc_classrooms c WHERE c.id = gc_class_members.classroom_id AND c.owner_id = auth.uid()
  ));

-- Students can join via insert
CREATE POLICY "Students can join classes" ON public.gc_class_members
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND role = 'student');

-- Assignments: visible to class participants
CREATE POLICY "Assignments visible to class" ON public.gc_assignments
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.gc_class_members WHERE classroom_id = gc_assignments.classroom_id AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.gc_classrooms WHERE id = gc_assignments.classroom_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Teachers can manage assignments" ON public.gc_assignments
  FOR ALL TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Submissions: students see own, teachers see all in class
CREATE POLICY "Students see own submissions" ON public.gc_submissions
  FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.gc_assignments a 
    JOIN public.gc_classrooms c ON c.id = a.classroom_id 
    WHERE a.id = gc_submissions.assignment_id AND c.owner_id = auth.uid()
  ));

CREATE POLICY "Students can submit" ON public.gc_submissions
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own submissions" ON public.gc_submissions
  FOR UPDATE TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can grade" ON public.gc_submissions
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.gc_assignments a 
    JOIN public.gc_classrooms c ON c.id = a.classroom_id 
    WHERE a.id = gc_submissions.assignment_id AND c.owner_id = auth.uid()
  ));

-- Announcements: visible to class
CREATE POLICY "Announcements visible to class" ON public.gc_announcements
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.gc_class_members WHERE classroom_id = gc_announcements.classroom_id AND user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.gc_classrooms WHERE id = gc_announcements.classroom_id AND owner_id = auth.uid()
  ));

CREATE POLICY "Teachers can post announcements" ON public.gc_announcements
  FOR ALL TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Comments: visible to participants
CREATE POLICY "Comments visible to participants" ON public.gc_comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can post comments" ON public.gc_comments
  FOR INSERT TO authenticated
  WITH CHECK (author_id = auth.uid());

-- Updated_at triggers
CREATE TRIGGER update_gc_classrooms_updated_at BEFORE UPDATE ON public.gc_classrooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gc_assignments_updated_at BEFORE UPDATE ON public.gc_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gc_submissions_updated_at BEFORE UPDATE ON public.gc_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gc_announcements_updated_at BEFORE UPDATE ON public.gc_announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
