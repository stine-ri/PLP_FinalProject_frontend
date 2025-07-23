import axios from 'axios';

// const API_BASE_URL = 'https://mama-shule.onrender.com/api';

export interface Student {
  _id: string;
  name: string;
  classLevel: string;
  parentId?: string;
  teacherId?: string;
}

export interface AssignedClass {
  _id: string;
  className: string;
  subject: string;
  teacherId: string;
}

export interface ResultData {
  studentId: string;
  subject: string;
  marks: number;
  term: string;
}


export interface AttendanceData {
  studentId: string;
  classId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface HomeworkData {
  classId: string;
  subject: string;
  task: string;
  description: string;
  dueDate: string;
}

export interface NotificationData {
  title: string;
  message: string;
  recipientRole: 'admin' | 'teacher' | 'parent';
}

// Fetch all students
export const fetchStudents = async (): Promise<Student[]> => {
  const res = await fetch('https://mama-shule.onrender.com/api/students');
  return res.json();
};

// Fetch all assigned classes
export const fetchAssignedClasses = async (): Promise<AssignedClass[]> => {
  const res = await fetch('https://mama-shule.onrender.com/api/classes');
  return res.json();
};

// Upload student results
export const uploadResults = async (data: ResultData): Promise<void> => {
  await fetch('https://mama-shule.onrender.com/api/results', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
};

// Mark attendance
export const markAttendance = async (data: AttendanceData) => {
  const res = await fetch('https://mama-shule.onrender.com/api/attendance/mark', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to mark attendance');
  }

  return res.json();
};
// Assign homework
export const assignHomework = async (data: HomeworkData): Promise<void> => {
  await fetch('https://mama-shule.onrender.com/api/homework', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
};

// Notify admin
export const notifyAdmin = async (data: NotificationData): Promise<void> => {
  await fetch('https://mama-shule.onrender.com/api/notify', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
};


//announcements
export const fetchAnnouncements = async () => {
  const response = await axios.get('https://mama-shule.onrender.com/api/announcements');
  return response.data;
};

export const createAnnouncement = async (announcementData: {
  title: string;
  content: string;
  priority: string;
}) => {
  const response = await axios.post('https://mama-shule.onrender.com/api/announcements', announcementData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};
// assigned teacher
// services/api.ts
export const getAssignedTeacher = async () => {
  const response = await axios.get('https://mama-shule.onrender.com/api/teacher');
  return response.data;
};

export const updateAssignedTeacher = async (name: string) => {
  const response = await axios.put('https://mama-shule.onrender.com/api/teacher', { name }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};