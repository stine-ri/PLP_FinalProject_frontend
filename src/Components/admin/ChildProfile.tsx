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
    email: string;
  };
}

interface AdminChildProfileProps {
  compact?: boolean;
  filters?: Record<string, string | number>;
}

export const AdminChildProfile: React.FC<AdminChildProfileProps> = ({ 
  compact = false, 
  filters = {} 
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

      const query = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        query.append(key, String(value));
      });

      const response = await axios.get(`http://localhost:5000/api/children?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setState({
        loading: false,
        error: '',
        childData: response.data[0] || null,
        multipleChildren: response.data
      });
    } catch (err) {
      let errorMessage = 'An unexpected error occurred';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || 'Failed to fetch child data';
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
}, [filters]);


  return (
    <ChildProfileBase
      {...state}
      compact={compact}
      title="Children Management"
      requiredRole="admin"
    >
      {({ childData, multipleChildren, compact }) => (
  <>
    {childData && (
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-2">Highlighted Child</h2>
        <p><strong>Name:</strong> {childData.name}</p>
        <p><strong>Age:</strong> {childData.age}</p>
        <p><strong>Parent:</strong> {childData.parentId?.name || 'N/A'}</p>
        <p><strong>Email:</strong> {childData.parentId?.email || 'N/A'}</p>
      </div>
    )}

    {multipleChildren.length > 0 ? (
      <div className={compact ? 'overflow-x-auto' : ''}>
        <table className={`w-full ${compact ? 'text-sm' : ''}`}>
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Age</th>
              <th className="p-2 text-left">Parent</th>
              {!compact && <th className="p-2 text-left">Parent Email</th>}
            </tr>
          </thead>
          <tbody>
            {multipleChildren.map(child => (
              <tr key={child._id} className="border-b">
                <td className="p-2">{child.name}</td>
                <td className="p-2">{child.age}</td>
                <td className="p-2">{child.parentId?.name || 'N/A'}</td>
                {!compact && (
                  <td className="p-2">{child.parentId?.email || 'N/A'}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p>No children found</p>
    )}
  </>
)}

    </ChildProfileBase>
  );
};