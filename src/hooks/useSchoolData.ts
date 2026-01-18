/**
 * School Management System Data Hooks
 * Provides real-time data from Supabase for the School System
 */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface SchoolInstitution {
  id: string;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SchoolBranch {
  id: string;
  institution_id: string;
  name: string;
  code: string;
  city: string | null;
  is_active: boolean;
}

export interface SchoolStudent {
  id: string;
  admission_number: string;
  roll_number: string | null;
  current_class_id: string | null;
  current_section_id: string | null;
  gender: string | null;
  status: string;
  is_active: boolean;
  branch_id: string | null;
}

export interface SchoolStaff {
  id: string;
  employee_id: string;
  staff_type: string;
  department: string | null;
  designation: string | null;
  is_active: boolean;
  branch_id: string | null;
}

export interface SchoolClass {
  id: string;
  name: string;
  numeric_level: number | null;
  is_active: boolean;
}

export interface SchoolAttendance {
  id: string;
  student_id: string;
  attendance_date: string;
  status: string;
}

export interface SchoolFeePayment {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  status: string;
}

export interface SchoolNotice {
  id: string;
  title: string;
  content: string;
  notice_type: string | null;
  is_published: boolean;
  created_at: string;
}

export interface SchoolTransportRoute {
  id: string;
  route_name: string;
  vehicle_number: string | null;
  driver_name: string | null;
  is_active: boolean;
}

// Main Hook
export function useSchoolData(institutionCode: string = 'DPS-001') {
  const [institution, setInstitution] = useState<SchoolInstitution | null>(null);
  const [branches, setBranches] = useState<SchoolBranch[]>([]);
  const [students, setStudents] = useState<SchoolStudent[]>([]);
  const [staff, setStaff] = useState<SchoolStaff[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [attendance, setAttendance] = useState<SchoolAttendance[]>([]);
  const [feePayments, setFeePayments] = useState<SchoolFeePayment[]>([]);
  const [notices, setNotices] = useState<SchoolNotice[]>([]);
  const [transportRoutes, setTransportRoutes] = useState<SchoolTransportRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch institution
      const { data: instData, error: instError } = await supabase
        .from('school_institutions')
        .select('*')
        .eq('code', institutionCode)
        .single();

      if (instError) throw instError;
      setInstitution(instData);

      if (instData) {
        // Fetch all related data in parallel
        const [
          branchesRes,
          studentsRes,
          staffRes,
          classesRes,
          noticesRes,
          transportRes
        ] = await Promise.all([
          supabase.from('school_branches').select('*').eq('institution_id', instData.id),
          supabase.from('school_students').select('*').eq('institution_id', instData.id),
          supabase.from('school_staff').select('*').eq('institution_id', instData.id),
          supabase.from('school_classes').select('*').eq('institution_id', instData.id).order('numeric_level'),
          supabase.from('school_notices').select('*').eq('institution_id', instData.id).order('created_at', { ascending: false }).limit(10),
          supabase.from('school_transport_routes').select('*').eq('institution_id', instData.id)
        ]);

        setBranches(branchesRes.data || []);
        setStudents(studentsRes.data || []);
        setStaff(staffRes.data || []);
        setClasses(classesRes.data || []);
        setNotices(noticesRes.data || []);
        setTransportRoutes(transportRes.data || []);

        // Fetch today's attendance
        const today = new Date().toISOString().split('T')[0];
        const { data: attendanceData } = await supabase
          .from('school_attendance')
          .select('*')
          .eq('attendance_date', today);
        setAttendance(attendanceData || []);

        // Fetch fee payments for current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const { data: feeData } = await supabase
          .from('school_fee_payments')
          .select('*')
          .gte('payment_date', startOfMonth.toISOString().split('T')[0]);
        setFeePayments(feeData || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [institutionCode]);

  // Computed stats
  const stats = {
    totalStudents: students.filter(s => s.is_active).length,
    totalStaff: staff.filter(s => s.is_active).length,
    teachingStaff: staff.filter(s => s.is_active && ['teacher', 'class_teacher'].includes(s.staff_type)).length,
    nonTeachingStaff: staff.filter(s => s.is_active && !['teacher', 'class_teacher'].includes(s.staff_type)).length,
    totalClasses: classes.length,
    totalBranches: branches.filter(b => b.is_active).length,
    todayPresent: attendance.filter(a => a.status === 'present').length,
    todayAbsent: attendance.filter(a => a.status === 'absent').length,
    monthlyRevenue: feePayments.reduce((sum, p) => sum + Number(p.amount), 0),
    totalRoutes: transportRoutes.filter(r => r.is_active).length
  };

  // Branch-wise stats
  const branchStats = branches.map(branch => ({
    ...branch,
    studentCount: students.filter(s => s.branch_id === branch.id && s.is_active).length,
    staffCount: staff.filter(s => s.branch_id === branch.id && s.is_active).length
  }));

  return {
    institution,
    branches,
    branchStats,
    students,
    staff,
    classes,
    attendance,
    feePayments,
    notices,
    transportRoutes,
    stats,
    loading,
    error,
    refresh: fetchData
  };
}

// CRUD Operations
export function useSchoolCRUD() {
  const [loading, setLoading] = useState(false);

  // Add Student
  const addStudent = async (student: Partial<SchoolStudent> & { institution_id: string; admission_number: string }) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('school_students')
      .insert([student])
      .select()
      .single();
    setLoading(false);
    return { data, error };
  };

  // Update Student
  const updateStudent = async (id: string, updates: Partial<SchoolStudent>) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('school_students')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    setLoading(false);
    return { data, error };
  };

  // Delete Student (soft delete)
  const deleteStudent = async (id: string) => {
    setLoading(true);
    const { error } = await supabase
      .from('school_students')
      .update({ is_active: false, status: 'inactive' })
      .eq('id', id);
    setLoading(false);
    return { error };
  };

  // Add Staff
  const addStaff = async (staffMember: Partial<SchoolStaff> & { institution_id: string; user_id: string; employee_id: string; staff_type: string }) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('school_staff')
      .insert([staffMember] as any)
      .select()
      .single();
    setLoading(false);
    return { data, error };
  };

  // Mark Attendance
  const markAttendance = async (studentId: string, sectionId: string, status: string, staffId: string) => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('school_attendance')
      .upsert({
        student_id: studentId,
        section_id: sectionId,
        attendance_date: today,
        status,
        marked_by: staffId
      }, { onConflict: 'student_id,attendance_date' })
      .select()
      .single();
    setLoading(false);
    return { data, error };
  };

  // Record Fee Payment
  const recordFeePayment = async (payment: {
    student_id: string;
    amount: number;
    payment_method: string;
    collected_by: string;
  }) => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('school_fee_payments') as any)
      .insert({
        ...payment,
        payment_date: new Date().toISOString().split('T')[0],
        receipt_number: `REC-${Date.now()}`,
        status: 'completed'
      })
      .select()
      .single();
    setLoading(false);
    return { data, error };
  };

  // Publish Notice
  const publishNotice = async (notice: {
    institution_id: string;
    title: string;
    content: string;
    notice_type: string;
    created_by: string;
  }) => {
    setLoading(true);
    const { data, error } = await (supabase
      .from('school_notices') as any)
      .insert([{
        ...notice,
        is_published: true,
        published_at: new Date().toISOString()
      }])
      .select()
      .single();
    setLoading(false);
    return { data, error };
  };

  return {
    loading,
    addStudent,
    updateStudent,
    deleteStudent,
    addStaff,
    markAttendance,
    recordFeePayment,
    publishNotice
  };
}
