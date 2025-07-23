import React from 'react';
import { getCurrentRole } from '../utils/authHelper';
import type { ChildData } from '../types/child'; 

type ChildProfileBaseProps = {
  children: (props: {
    childData: ChildData | null;
    multipleChildren: ChildData[];
    compact: boolean;
  }) => React.ReactNode;
  compact?: boolean;
  title?: string;
  loading: boolean;
  error: string;
  childData: ChildData | null;
  multipleChildren: ChildData[];
  requiredRole?: string | string[];
};

export const ChildProfileBase: React.FC<ChildProfileBaseProps> = ({ 
  children,
  compact = false,
  title = 'Child Profile',
  loading,
  error,
  childData,
  multipleChildren,
  requiredRole
}) => {
  const currentRole = getCurrentRole();

  // Check role permissions
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!currentRole || !allowedRoles.includes(currentRole)) {
      return (
        <div className="p-4 text-red-500">
          Unauthorized access. Required role: {allowedRoles.join(' or ')}
        </div>
      );
    }
  }

  if (loading) return <div className="p-4">Loading child data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className={`${compact ? 'p-2' : 'p-4'} bg-white shadow rounded`}>
      <h2 className={`${compact ? 'text-lg' : 'text-xl'} font-bold`}>{title}</h2>
      {children({
        childData,
        multipleChildren,
        compact
      })}
    </div>
  );
};