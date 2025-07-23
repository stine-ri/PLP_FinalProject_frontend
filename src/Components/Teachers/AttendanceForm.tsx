import  { useState, useEffect } from 'react';
import axios from 'axios';

interface Student {
  _id: string;
  name: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  status: string;
  studentId: string;
}

export const TeacherAttendance = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          axios.get('https://mama-shule.onrender.com/api/students'),
          axios.get(`https://mama-shule.onrender.com/api/attendance/classId?date=${date}`)
        ]);
        setStudents(studentsRes.data);
        setAttendance(attendanceRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  const handleStatusChange = async (studentId: string, newStatus: string) => {
    try {
      await axios.post('https://mama-shule.onrender.com/api/attendance', {
        studentId,
        date,
        status: newStatus,
        classId: 'classId' // Replace with actual class ID
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Refresh attendance data
      const res = await axios.get(`https://mama-shule.onrender.com/api/attendance/classId?date=${date}`);
      setAttendance(res.data);
    } catch (err) {
      console.error('Error updating attendance:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Class Attendance</h2>
      <div className="mb-4">
        <label className="block mb-2">Date:</label>
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Student</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const record = attendance.find(a => a.studentId === student._id);
            return (
              <tr key={student._id} className="border-t">
                <td className="py-2">{student.name}</td>
                <td className="py-2">
                  <select
                    value={record?.status || ''}
                    onChange={(e) => handleStatusChange(student._id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};