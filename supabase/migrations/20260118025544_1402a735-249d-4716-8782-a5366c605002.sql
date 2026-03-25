-- School Management System Database Schema
-- Core tables for a fully functional school system

-- School Institutions (Multi-School Support)
CREATE TABLE public.school_institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    phone TEXT,
    email TEXT,
    website TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- School Branches
CREATE TABLE public.school_branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    address TEXT,
    city TEXT,
    phone TEXT,
    principal_user_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(institution_id, code)
);

-- School Users (Staff, Teachers, Admin)
CREATE TABLE public.school_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.school_branches(id) ON DELETE SET NULL,
    employee_id TEXT NOT NULL,
    staff_type TEXT NOT NULL CHECK (staff_type IN ('super_admin', 'principal', 'vice_principal', 'admin_office', 'teacher', 'class_teacher', 'accountant', 'librarian', 'transport_manager', 'hostel_manager', 'exam_controller', 'hr_manager', 'support_staff')),
    department TEXT,
    designation TEXT,
    joining_date DATE,
    phone TEXT,
    emergency_contact TEXT,
    address TEXT,
    qualification TEXT,
    experience_years INTEGER,
    salary_grade TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Academic Years
CREATE TABLE public.school_academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Classes
CREATE TABLE public.school_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    numeric_level INTEGER,
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Sections
CREATE TABLE public.school_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.school_classes(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.school_branches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    class_teacher_id UUID REFERENCES public.school_staff(id) ON DELETE SET NULL,
    room_number TEXT,
    capacity INTEGER DEFAULT 40,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Students
CREATE TABLE public.school_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.school_branches(id) ON DELETE SET NULL,
    admission_number TEXT NOT NULL,
    roll_number TEXT,
    current_class_id UUID REFERENCES public.school_classes(id) ON DELETE SET NULL,
    current_section_id UUID REFERENCES public.school_sections(id) ON DELETE SET NULL,
    admission_date DATE,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    blood_group TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    photo_url TEXT,
    previous_school TEXT,
    transport_route_id UUID,
    hostel_room_id UUID,
    is_active BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'passed_out', 'transferred', 'dropped')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Parents/Guardians
CREATE TABLE public.school_parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    student_id UUID REFERENCES public.school_students(id) ON DELETE CASCADE,
    relation TEXT NOT NULL CHECK (relation IN ('father', 'mother', 'guardian', 'other')),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    occupation TEXT,
    annual_income TEXT,
    address TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Subjects
CREATE TABLE public.school_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    subject_type TEXT DEFAULT 'regular' CHECK (subject_type IN ('regular', 'elective', 'optional', 'language')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Class Subject Mapping
CREATE TABLE public.school_class_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.school_classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.school_subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.school_staff(id) ON DELETE SET NULL,
    periods_per_week INTEGER DEFAULT 5,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(class_id, subject_id)
);

-- Student Attendance
CREATE TABLE public.school_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.school_students(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.school_sections(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half_day', 'leave')),
    remarks TEXT,
    marked_by UUID REFERENCES public.school_staff(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, attendance_date)
);

-- Staff Attendance
CREATE TABLE public.school_staff_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES public.school_staff(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'half_day', 'leave', 'work_from_home')),
    leave_type TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(staff_id, attendance_date)
);

-- Fee Structure
CREATE TABLE public.school_fee_structure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.school_academic_years(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.school_classes(id) ON DELETE CASCADE,
    fee_type TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    due_date DATE,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Fee Payments
CREATE TABLE public.school_fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.school_students(id) ON DELETE CASCADE,
    fee_structure_id UUID REFERENCES public.school_fee_structure(id) ON DELETE SET NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('cash', 'cheque', 'online', 'card', 'upi')),
    receipt_number TEXT,
    transaction_id TEXT,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    collected_by UUID REFERENCES public.school_staff(id),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Examinations
CREATE TABLE public.school_examinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.school_academic_years(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    exam_type TEXT CHECK (exam_type IN ('unit_test', 'quarterly', 'half_yearly', 'annual', 'board')),
    start_date DATE,
    end_date DATE,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Exam Results
CREATE TABLE public.school_exam_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    examination_id UUID REFERENCES public.school_examinations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.school_students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.school_subjects(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2),
    max_marks DECIMAL(5,2) DEFAULT 100,
    grade TEXT,
    remarks TEXT,
    entered_by UUID REFERENCES public.school_staff(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(examination_id, student_id, subject_id)
);

-- Transport Routes
CREATE TABLE public.school_transport_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    route_name TEXT NOT NULL,
    route_number TEXT,
    vehicle_number TEXT,
    driver_name TEXT,
    driver_phone TEXT,
    capacity INTEGER,
    monthly_fee DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Transport Stops
CREATE TABLE public.school_transport_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID REFERENCES public.school_transport_routes(id) ON DELETE CASCADE,
    stop_name TEXT NOT NULL,
    stop_order INTEGER,
    pickup_time TIME,
    drop_time TIME,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Hostel Rooms
CREATE TABLE public.school_hostel_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.school_branches(id) ON DELETE SET NULL,
    room_number TEXT NOT NULL,
    room_type TEXT CHECK (room_type IN ('single', 'double', 'triple', 'dormitory')),
    capacity INTEGER,
    floor INTEGER,
    block TEXT,
    monthly_fee DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Notices/Circulars
CREATE TABLE public.school_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.school_branches(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    notice_type TEXT CHECK (notice_type IN ('general', 'academic', 'event', 'holiday', 'urgent', 'exam')),
    target_audience TEXT[] DEFAULT ARRAY['all'],
    attachment_url TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.school_staff(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Library Books
CREATE TABLE public.school_library_books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES public.school_institutions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT,
    isbn TEXT,
    publisher TEXT,
    category TEXT,
    quantity INTEGER DEFAULT 1,
    available_quantity INTEGER DEFAULT 1,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Library Transactions
CREATE TABLE public.school_library_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES public.school_library_books(id) ON DELETE CASCADE,
    borrower_type TEXT CHECK (borrower_type IN ('student', 'staff')),
    borrower_id UUID NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue', 'lost')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Timetable
CREATE TABLE public.school_timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES public.school_sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.school_subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.school_staff(id) ON DELETE SET NULL,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    period_number INTEGER,
    start_time TIME,
    end_time TIME,
    room_number TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(section_id, day_of_week, period_number)
);

-- Enable RLS on all tables
ALTER TABLE public.school_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_fee_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_examinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_transport_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_library_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_timetable ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users (full access for now - can be refined by role)
CREATE POLICY "Authenticated users can view institutions" ON public.school_institutions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage institutions" ON public.school_institutions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view branches" ON public.school_branches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage branches" ON public.school_branches FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view staff" ON public.school_staff FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage staff" ON public.school_staff FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view academic years" ON public.school_academic_years FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage academic years" ON public.school_academic_years FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view classes" ON public.school_classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage classes" ON public.school_classes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view sections" ON public.school_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage sections" ON public.school_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view students" ON public.school_students FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage students" ON public.school_students FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view parents" ON public.school_parents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage parents" ON public.school_parents FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view subjects" ON public.school_subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage subjects" ON public.school_subjects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view class subjects" ON public.school_class_subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage class subjects" ON public.school_class_subjects FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view attendance" ON public.school_attendance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage attendance" ON public.school_attendance FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view staff attendance" ON public.school_staff_attendance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage staff attendance" ON public.school_staff_attendance FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view fee structure" ON public.school_fee_structure FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage fee structure" ON public.school_fee_structure FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view fee payments" ON public.school_fee_payments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage fee payments" ON public.school_fee_payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view examinations" ON public.school_examinations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage examinations" ON public.school_examinations FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view exam results" ON public.school_exam_results FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage exam results" ON public.school_exam_results FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view transport routes" ON public.school_transport_routes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage transport routes" ON public.school_transport_routes FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view transport stops" ON public.school_transport_stops FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage transport stops" ON public.school_transport_stops FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view hostel rooms" ON public.school_hostel_rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage hostel rooms" ON public.school_hostel_rooms FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view notices" ON public.school_notices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage notices" ON public.school_notices FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view library books" ON public.school_library_books FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage library books" ON public.school_library_books FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view library transactions" ON public.school_library_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage library transactions" ON public.school_library_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can view timetable" ON public.school_timetable FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage timetable" ON public.school_timetable FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Insert sample institution
INSERT INTO public.school_institutions (name, code, city, state, country, phone, email)
VALUES ('Delhi Public School', 'DPS-001', 'New Delhi', 'Delhi', 'India', '+91-11-23456789', 'admin@dps.edu.in');

-- Insert sample branches
INSERT INTO public.school_branches (institution_id, name, code, city)
SELECT id, 'Main Campus', 'MAIN', 'New Delhi' FROM public.school_institutions WHERE code = 'DPS-001';

INSERT INTO public.school_branches (institution_id, name, code, city)
SELECT id, 'North Branch', 'NORTH', 'North Delhi' FROM public.school_institutions WHERE code = 'DPS-001';

INSERT INTO public.school_branches (institution_id, name, code, city)
SELECT id, 'South Branch', 'SOUTH', 'South Delhi' FROM public.school_institutions WHERE code = 'DPS-001';

-- Insert sample academic year
INSERT INTO public.school_academic_years (institution_id, name, start_date, end_date, is_current)
SELECT id, '2025-2026', '2025-04-01', '2026-03-31', true FROM public.school_institutions WHERE code = 'DPS-001';

-- Insert sample classes
INSERT INTO public.school_classes (institution_id, name, numeric_level, display_order)
SELECT id, 'Class ' || level, level, level 
FROM public.school_institutions, generate_series(1, 12) AS level 
WHERE code = 'DPS-001';

-- Insert sample subjects
INSERT INTO public.school_subjects (institution_id, name, code, subject_type)
SELECT id, subject, UPPER(LEFT(subject, 3)), 'regular'
FROM public.school_institutions, 
     unnest(ARRAY['English', 'Hindi', 'Mathematics', 'Science', 'Social Studies', 'Computer Science', 'Physical Education', 'Art & Craft', 'Music']) AS subject
WHERE code = 'DPS-001';