// Realistic demo data for Google Classroom clone - no auth required
// All data is local, no database dependency for demo viewing

export const demoClassrooms = [
  { id: 'c1', name: 'Mathematics 101', section: 'Section A', subject: 'Mathematics', room: 'Room 204', description: 'Algebra, Geometry, and Trigonometry fundamentals', class_code: 'MTH101A', is_archived: false, created_at: '2026-02-15T10:00:00Z' },
  { id: 'c2', name: 'English Literature', section: 'Section B', subject: 'English', room: 'Room 112', description: 'Shakespeare, Poetry, and Modern Literature', class_code: 'ENG201B', is_archived: false, created_at: '2026-02-10T09:00:00Z' },
  { id: 'c3', name: 'Physics Advanced', section: 'Section A', subject: 'Physics', room: 'Lab 3', description: 'Mechanics, Thermodynamics, and Optics', class_code: 'PHY301A', is_archived: false, created_at: '2026-02-08T08:00:00Z' },
  { id: 'c4', name: 'Computer Science', section: 'Section C', subject: 'CS', room: 'Lab 1', description: 'Programming, Data Structures, and Algorithms', class_code: 'CS401C', is_archived: false, created_at: '2026-01-20T11:00:00Z' },
  { id: 'c5', name: 'Biology', section: 'Section A', subject: 'Biology', room: 'Room 305', description: 'Cell Biology, Genetics, and Evolution', class_code: 'BIO102A', is_archived: false, created_at: '2026-01-15T10:30:00Z' },
  { id: 'c6', name: 'History & Civics', section: 'Section B', subject: 'History', room: 'Room 108', description: 'World History and Democratic Governance', class_code: 'HIS201B', is_archived: false, created_at: '2026-01-10T09:30:00Z' },
];

export const demoStudents = [
  { id: 's1', name: 'Aarav Sharma', email: 'aarav.s@school.edu', avatar: 'AS' },
  { id: 's2', name: 'Priya Patel', email: 'priya.p@school.edu', avatar: 'PP' },
  { id: 's3', name: 'Rahul Kumar', email: 'rahul.k@school.edu', avatar: 'RK' },
  { id: 's4', name: 'Sneha Gupta', email: 'sneha.g@school.edu', avatar: 'SG' },
  { id: 's5', name: 'Vikram Singh', email: 'vikram.s@school.edu', avatar: 'VS' },
  { id: 's6', name: 'Ananya Reddy', email: 'ananya.r@school.edu', avatar: 'AR' },
  { id: 's7', name: 'Karan Mehta', email: 'karan.m@school.edu', avatar: 'KM' },
  { id: 's8', name: 'Divya Nair', email: 'divya.n@school.edu', avatar: 'DN' },
  { id: 's9', name: 'Arjun Rao', email: 'arjun.r@school.edu', avatar: 'AR' },
  { id: 's10', name: 'Meera Joshi', email: 'meera.j@school.edu', avatar: 'MJ' },
  { id: 's11', name: 'Rohan Verma', email: 'rohan.v@school.edu', avatar: 'RV' },
  { id: 's12', name: 'Ishita Das', email: 'ishita.d@school.edu', avatar: 'ID' },
];

export const demoTeachers = [
  { id: 't1', name: 'Dr. Rajesh Iyer', email: 'rajesh.iyer@school.edu', avatar: 'RI', subject: 'Mathematics' },
  { id: 't2', name: 'Ms. Kavitha Nair', email: 'kavitha.n@school.edu', avatar: 'KN', subject: 'English' },
  { id: 't3', name: 'Prof. Sanjay Menon', email: 'sanjay.m@school.edu', avatar: 'SM', subject: 'Physics' },
];

export const demoAssignments = [
  { id: 'a1', title: 'Quadratic Equations Worksheet', description: 'Solve problems 1-20 from Chapter 4', classroom_id: 'c1', classroom_name: 'Mathematics 101', max_points: 100, assignment_type: 'assignment', status: 'published', due_date: '2026-03-15T23:59:00Z', created_at: '2026-03-01T10:00:00Z', submissions_count: 10, graded_count: 8, avg_grade: 82 },
  { id: 'a2', title: 'Shakespeare Essay', description: 'Write a 1000-word essay on Hamlet\'s soliloquy', classroom_id: 'c2', classroom_name: 'English Literature', max_points: 50, assignment_type: 'assignment', status: 'published', due_date: '2026-03-12T23:59:00Z', created_at: '2026-02-28T09:00:00Z', submissions_count: 8, graded_count: 8, avg_grade: 38 },
  { id: 'a3', title: 'Newton\'s Laws Quiz', description: 'Multiple choice quiz covering all three laws', classroom_id: 'c3', classroom_name: 'Physics Advanced', max_points: 25, assignment_type: 'quiz', status: 'published', due_date: '2026-03-10T14:00:00Z', created_at: '2026-02-25T08:00:00Z', submissions_count: 12, graded_count: 12, avg_grade: 20 },
  { id: 'a4', title: 'Python Programming Lab', description: 'Build a calculator using functions', classroom_id: 'c4', classroom_name: 'Computer Science', max_points: 100, assignment_type: 'assignment', status: 'published', due_date: '2026-03-18T23:59:00Z', created_at: '2026-03-05T11:00:00Z', submissions_count: 6, graded_count: 4, avg_grade: 91 },
  { id: 'a5', title: 'Cell Division Reading', description: 'Read Chapter 7 and take notes', classroom_id: 'c5', classroom_name: 'Biology', max_points: 0, assignment_type: 'material', status: 'published', due_date: null, created_at: '2026-03-02T10:30:00Z', submissions_count: 0, graded_count: 0, avg_grade: 0 },
  { id: 'a6', title: 'Trigonometry Mid-Term', description: 'Chapters 1-6 comprehensive exam', classroom_id: 'c1', classroom_name: 'Mathematics 101', max_points: 200, assignment_type: 'quiz', status: 'published', due_date: '2026-03-20T10:00:00Z', created_at: '2026-03-06T10:00:00Z', submissions_count: 2, graded_count: 0, avg_grade: 0 },
  { id: 'a7', title: 'World War II Discussion', description: 'What were the key turning points?', classroom_id: 'c6', classroom_name: 'History & Civics', max_points: 10, assignment_type: 'question', status: 'published', due_date: '2026-03-08T23:59:00Z', created_at: '2026-03-04T09:30:00Z', submissions_count: 9, graded_count: 9, avg_grade: 8 },
  { id: 'a8', title: 'Data Structures Assignment', description: 'Implement Stack and Queue in Java', classroom_id: 'c4', classroom_name: 'Computer Science', max_points: 100, assignment_type: 'assignment', status: 'draft', due_date: '2026-03-25T23:59:00Z', created_at: '2026-03-07T11:00:00Z', submissions_count: 0, graded_count: 0, avg_grade: 0 },
];

export const demoAnnouncements = [
  { id: 'an1', content: 'Welcome to the new semester! Please review the updated syllabus shared in the Materials section. Office hours are Monday & Wednesday 3-5 PM.', classroom_id: 'c1', classroom_name: 'Mathematics 101', author_name: 'Dr. Rajesh Iyer', is_pinned: true, created_at: '2026-03-07T10:00:00Z' },
  { id: 'an2', content: 'The Shakespeare essay deadline has been extended to March 15. Please use MLA format for citations.', classroom_id: 'c2', classroom_name: 'English Literature', author_name: 'Ms. Kavitha Nair', is_pinned: false, created_at: '2026-03-06T14:30:00Z' },
  { id: 'an3', content: 'Physics lab session rescheduled to Thursday 2 PM due to equipment maintenance. Bring your lab notebooks.', classroom_id: 'c3', classroom_name: 'Physics Advanced', author_name: 'Prof. Sanjay Menon', is_pinned: false, created_at: '2026-03-05T11:15:00Z' },
  { id: 'an4', content: 'Great job on the Python quiz everyone! Class average was 91%. Keep up the excellent work!', classroom_id: 'c4', classroom_name: 'Computer Science', author_name: 'Dr. Rajesh Iyer', is_pinned: false, created_at: '2026-03-04T16:00:00Z' },
  { id: 'an5', content: 'Parent-Teacher meeting scheduled for March 22. Please inform your parents to register on the portal.', classroom_id: 'c1', classroom_name: 'Mathematics 101', author_name: 'Dr. Rajesh Iyer', is_pinned: true, created_at: '2026-03-03T09:00:00Z' },
  { id: 'an6', content: 'Biology field trip to the Botanical Garden on March 25. Permission slips due by March 20.', classroom_id: 'c5', classroom_name: 'Biology', author_name: 'Ms. Kavitha Nair', is_pinned: false, created_at: '2026-03-02T13:00:00Z' },
];

export const demoClassMembers: Record<string, { students: number; teachers: number }> = {
  c1: { students: 32, teachers: 1 },
  c2: { students: 28, teachers: 1 },
  c3: { students: 24, teachers: 1 },
  c4: { students: 35, teachers: 2 },
  c5: { students: 30, teachers: 1 },
  c6: { students: 26, teachers: 1 },
};
