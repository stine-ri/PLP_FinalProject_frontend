import React, { useEffect, useState } from "react";
import axios from "axios";

interface Performance {
  studentName: string;
  subject: string;
  score: number;
}
interface Props{
    studentId: string;
    isParent?: boolean;
}
const StudentPerformance: React.FC<Props> = ({ studentId, isParent }) => {
  const [performanceData, setPerformanceData] = useState<Performance[]>([]);
  const token = localStorage.getItem("token");
  console.log("Token being sent:", token);
  if (!token) {
    console.error("No token found in localStorage");
  }
  
  const fetchPerformance = async () => {
    try {
      const url = studentId
        ? `https://mama-shule.onrender.com/api/performance/${studentId}`
        : "https://mama-shule.onrender.com/api/performance";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerformanceData(res.data);
    } catch (err) {
      console.error("Error fetching performance", err);
    }
  };

  useEffect(() => {
    fetchPerformance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow mt-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Student Performance</h2>

      {!isParent && (
        <form onSubmit={e => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Only teachers/admins should see form */}
          {/* Add your existing form here if needed */}
        </form>
      )}

      <table className="w-full text-left">
        <thead>
          <tr className="text-purple-700">
            <th className="py-2">Student</th>
            <th>Subject</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {performanceData.map((entry, i) => (
            <tr key={i} className="border-t">
              <td className="py-1">{entry.studentName}</td>
              <td>{entry.subject}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentPerformance;