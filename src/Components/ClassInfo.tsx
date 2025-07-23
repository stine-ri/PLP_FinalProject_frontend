// components/ClassInfo.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';

interface ClassData {
  _id: string;
  name: string;
  grade: number;
  stream: string;
  teacherId?: {
    _id: string;
    name: string;
    email?: string;
  };
  students?: Array<{
    _id: string;
    name: string;
    age?: number;
  }>;
  schedule?: string;
}

export const ClassInfo: React.FC<{ classId?: string }> = ({ classId }) => {
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ClassData>>({});
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setUserRole(role);

    const fetchClassData = async () => {
      try {
        let url = 'http://localhost:5000/api/classes';
        if (classId) {
          url += `/${classId}`;
        }
        
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Handle array response (all classes) vs single class
        if (Array.isArray(response.data)) {
          setClassData(response.data[0]); // Show first class by default
        } else {
          setClassData(response.data);
        }
        setEditData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch class data');
        } else {
          setError('An unexpected error occurred');
        }
      }
      setLoading(false);
    };

    fetchClassData();
  }, [classId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'grade' ? parseInt(value) : value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/classes/${classData?._id}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClassData(response.data);
      setIsEditing(false);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(
        axiosError.response?.data?.message || 'Failed to update class'
      );
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/classes/${classData?._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClassData(null);
      alert('Class deleted successfully');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to delete class');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64 p-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
          <div className="mt-4 text-center">
            <p className="text-purple-700 font-medium animate-pulse">Loading class data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg shadow-md animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg">No class data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto min-h-screen">
      {/* Background Card */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 rounded-3xl transform rotate-1 shadow-2xl opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-3xl transform -rotate-1 shadow-2xl opacity-10"></div>
        
        {/* Top Card with Data */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 animate-fade-in">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 px-6 py-6 sm:px-8 sm:py-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full opacity-5 transform -translate-x-12 translate-y-12"></div>
            
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 mb-6 sm:mb-0">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                  <svg className="w-8 h-8 text-purple-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">Class Information</h1>
                  <p className="text-purple-200 text-lg mt-1">Manage your class details</p>
                </div>
              </div>
              
              {(userRole === 'teacher' && classData.teacherId?._id === localStorage.getItem('userId')) || userRole === 'admin' ? (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="group relative px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-800 font-bold rounded-xl hover:from-yellow-300 hover:to-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-purple-700 transform hover:scale-110 transition-all duration-200 shadow-xl"
                >
                  <span className="relative z-10 flex items-center">
                    {isEditing ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Class
                      </>
                    )}
                  </span>
                </button>
              ) : null}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 sm:p-10 bg-gradient-to-br from-gray-50 to-white">
            {isEditing ? (
              <div className="space-y-8 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-sm font-bold text-purple-700 mb-3 uppercase tracking-wide">
                      Class Name
                      <span className="text-yellow-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={editData.name || ''}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white text-purple-900 placeholder-purple-400 transition-all duration-200 shadow-lg text-lg font-semibold"
                        placeholder="Enter class name"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="h-6 w-6 text-purple-400 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-purple-700 mb-3 uppercase tracking-wide">
                      Grade Level
                      <span className="text-yellow-600 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="grade"
                        value={editData.grade || ''}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white text-purple-900 placeholder-purple-400 transition-all duration-200 shadow-lg text-lg font-semibold"
                        placeholder="Enter grade level"
                        min="1"
                        max="12"
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <svg className="h-6 w-6 text-purple-400 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-purple-700 mb-3 uppercase tracking-wide">
                    Stream
                    <span className="text-yellow-600 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="stream"
                      value={editData.stream || ''}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white text-purple-900 placeholder-purple-400 transition-all duration-200 shadow-lg text-lg font-semibold"
                      placeholder="Enter stream (e.g., A, B, Science, Arts)"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <svg className="h-6 w-6 text-purple-400 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
                  <button
                    onClick={handleSave}
                    className="flex-1 sm:flex-none group relative px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 transform hover:scale-105 transition-all duration-200 shadow-xl"
                  >
                    <span className="flex items-center justify-center text-lg">
                      <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </span>
                  </button>

                  {userRole === 'admin' && (
                    <button
                      onClick={handleDelete}
                      className="flex-1 sm:flex-none group relative px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transform hover:scale-105 transition-all duration-200 shadow-xl"
                    >
                      <span className="flex items-center justify-center text-lg">
                        <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Class
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                {/* Class Data Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center group-hover:bg-opacity-30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-200 text-sm font-semibold uppercase tracking-wide">Class Name</p>
                        <p className="text-2xl font-bold mt-1">{classData.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center group-hover:bg-opacity-30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-200 text-sm font-semibold uppercase tracking-wide">Grade Level</p>
                        <p className="text-2xl font-bold mt-1">Grade {classData.grade}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group md:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center group-hover:bg-opacity-30 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="text-right">
                        <p className="text-indigo-200 text-sm font-semibold uppercase tracking-wide">Stream</p>
                        <p className="text-2xl font-bold mt-1">Stream {classData.stream}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Teacher Information */}
                {classData.teacherId && (
                  <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center space-x-6">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center shadow-xl">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-white">
                        <p className="text-white text-opacity-80 text-sm font-semibold uppercase tracking-wide mb-1">Class Teacher</p>
                        <p className="text-2xl font-bold">{classData.teacherId.name}</p>
                        {classData.teacherId.email && (
                          <p className="text-white text-opacity-90 text-lg mt-1">{classData.teacherId.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons for Admin */}
                {userRole === 'admin' && (
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 pt-8 border-t-2 border-purple-100">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 sm:flex-none group relative px-10 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-200 transform hover:scale-105 transition-all duration-200 shadow-xl"
                    >
                      <span className="flex items-center justify-center text-lg">
                        <svg className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Class
                      </span>
                    </button>

                    <button
                      onClick={handleDelete}
                      className="flex-1 sm:flex-none group relative px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transform hover:scale-105 transition-all duration-200 shadow-xl"
                    >
                      <span className="flex items-center justify-center text-lg">
                        <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Class
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};