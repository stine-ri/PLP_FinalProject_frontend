// components/ParentDashboard.tsx
import { ClassInfo } from '../ClassInfo';

export const ParentDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Child's Class</h1>
      <ClassInfo />
    </div>
  );
};