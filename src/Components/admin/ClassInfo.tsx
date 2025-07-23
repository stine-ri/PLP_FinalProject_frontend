// components/AdminDashboard.tsx
import { ClassInfo } from '../ClassInfo';

export const AdminDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Class Management</h1>
      <ClassInfo />
    </div>
  );
};