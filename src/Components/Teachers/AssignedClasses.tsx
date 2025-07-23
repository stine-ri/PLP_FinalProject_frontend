// components/TeacherDashboard.tsx
import { ClassInfo } from '../ClassInfo';

export const TeacherDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Classes</h1>
      <ClassInfo />
    </div>
  );
};