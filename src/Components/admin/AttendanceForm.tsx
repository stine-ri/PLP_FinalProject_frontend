import  { useState, useEffect } from 'react';
import axios from 'axios';

interface AttendanceRecord {
  _id: string;
  date: string;
  status: string;
  studentId: { name: string };
  classId: { name: string };
  markedBy: { name: string };
}

export const AdminAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    classId: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchAttendance();
  }, [filter]);

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.classId) params.append('classId', filter.classId);
      if (filter.dateFrom) params.append('dateFrom', filter.dateFrom);
      if (filter.dateTo) params.append('dateTo', filter.dateTo);

      const response = await axios.get(`https://mama-shule.onrender.com/api/attendance?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setAttendance(response.data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`https://mama-shule.onrender.com/api/attendance/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchAttendance();
    } catch (err) {
      console.error('Error deleting attendance:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Attendance Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-2">Class:</label>
          <input
            type="text"
            value={filter.classId}
            onChange={(e) => setFilter({...filter, classId: e.target.value})}
            placeholder="Filter by class ID"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">From Date:</label>
          <input
            type="date"
            value={filter.dateFrom}
            onChange={(e) => setFilter({...filter, dateFrom: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">To Date:</label>
          <input
            type="date"
            value={filter.dateTo}
            onChange={(e) => setFilter({...filter, dateTo: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Student</th>
            <th className="p-2 text-left">Class</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Marked By</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record._id} className="border-t">
              <td className="p-2">{new Date(record.date).toLocaleDateString()}</td>
              <td className="p-2">{record.studentId.name}</td>
              <td className="p-2">{record.classId.name}</td>
              <td className="p-2">
                <span className={`font-medium ${
                  record.status === 'Present' ? 'text-green-600' : 
                  record.status === 'Absent' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {record.status}
                </span>
              </td>
              <td className="p-2">{record.markedBy.name}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(record._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};