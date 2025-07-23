import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChildProfileBase } from '../ChildProfileBase';
import { getAuthToken } from '../../utils/authHelper';

interface ChildData {
  _id: string;
  name: string;
  age: number;
  parentId: {
    _id: string;
    name: string;
    email?: string;
  };
}

interface TeacherChildProfileProps {
  compact?: boolean;
  classId?: string;
}

export const TeacherChildProfile: React.FC<TeacherChildProfileProps> = ({ 
  compact = false, 
  classId 
}) => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string;
    childData: ChildData | null;
    multipleChildren: ChildData[];
  }>({
    loading: true,
    error: '',
    childData: null,
    multipleChildren: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        if (!token) throw new Error('Authentication required');

        const url = classId 
          ? `https://mama-shule.onrender.com/api/children?classId=${classId}`
          : 'https://mama-shule.onrender.com/api/children';
          
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setState({
          loading: false,
          error: '',
          childData: response.data[0] || null,
          multipleChildren: response.data
        });
      } catch (err) {
  let errorMessage = 'Failed to fetch child data';

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || errorMessage;
  }

  setState({
    loading: false,
    error: errorMessage,
    childData: null,
    multipleChildren: []
  });
}
    };

    fetchData();
  }, [classId]);

  return (
    <ChildProfileBase
      {...state}
      compact={compact}
      title={classId ? "Class Children" : "All Children"}
      requiredRole={['teacher', 'admin']}
    >
      {({ childData, multipleChildren, compact }) => (
  <>
    {childData && (
      <div className="mb-4 p-4 border border-blue-300 rounded bg-blue-50 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Highlighted Child</h2>
        <p><strong>Name:</strong> {childData.name}</p>
        <p><strong>Age:</strong> {childData.age}</p>
        <p><strong>Parent:</strong> {childData.parentId?.name || 'N/A'}</p>
      </div>
    )}

    {multipleChildren.length > 0 ? (
      <div className={`grid ${compact ? 'grid-cols-2 gap-2' : 'grid-cols-1 gap-4'}`}>
        {multipleChildren.map(child => (
          <div key={child._id} className="p-3 bg-gray-50 rounded">
            <p className="font-medium">{child.name}</p>
            <p className="text-sm">Age: {child.age}</p>
            <p className="text-xs text-gray-500">
              Parent: {child.parentId?.name || 'N/A'}
            </p>
          </div>
        ))}
      </div>
    ) : (
      <p>No children found</p>
    )}
  </>
)}

    </ChildProfileBase>
  );
};