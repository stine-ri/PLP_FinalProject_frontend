import { useEffect, useState } from 'react';
import { HomeworkList } from '../../Components/HomeworkList';

export const TeacherDashboard = () => {
  const [classId, setClassId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassId = async () => {
      try {
        const teacherId = localStorage.getItem('userId'); // or 'teacherId' based on your key

        if (!teacherId) {
          console.error('No teacher ID found in localStorage.');
          return;
        }

        const response = await fetch(`https://mama-shule.onrender.com/api/classes/teacher/${teacherId}`);
        const data = await response.json();

        if (data?.class?._id) {
          setClassId(data.class._id);
        } else {
          console.warn('Class not found for this teacher.');
        }
      } catch (error) {
        console.error('Error fetching class ID:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassId();
  }, []);

  if (loading) return <p>Loading class data...</p>;
  if (!classId) return <p>No class found for this teacher.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Class Homework</h1>
      <HomeworkList classId={classId} />
    </div>
  );
};
