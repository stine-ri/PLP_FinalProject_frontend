import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppSelector } from '../../redux/hook';

interface Teacher {
  _id: string;
  name: string;
  updatedAt: string;
}

export const AssignedTeacher = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Get auth state from Redux
  const { token, role } = useAppSelector((state) => state.auth);
  const canEdit = ['admin', 'teacher'].includes(role || '');

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teacher', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTeacher(response.data);
        setTeacherName(response.data.name || '');
      } catch (err) {
        setError('Failed to load teacher information');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTeacher();
    } else {
      setLoading(false);
      setError('Authentication required');
    }
  }, [token]);

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      const response = await axios.put('http://localhost:5000/api/teacher', { name: teacherName }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTeacher(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update teacher');
      console.error('Error:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTeacherName(teacher?.name || '');
    setError('');
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <div className="bg-gradient-to-br from-purple-50 via-white to-yellow-50 rounded-2xl shadow-lg border border-purple-200/50 p-6 sm:p-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-8 h-8 border-3 border-yellow-200 border-b-yellow-500 rounded-full animate-spin animation-delay-300"></div>
            </div>
            <span className="text-purple-600 font-medium animate-pulse">Loading teacher information...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="w-full max-w-2xl mx-auto animate-fade-in">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg border border-red-200 p-6 sm:p-8 animate-shake">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="group relative bg-gradient-to-br from-purple-50 via-white to-yellow-50 rounded-2xl shadow-lg hover:shadow-xl border border-purple-200/50 hover:border-purple-300/70 transition-all duration-500 ease-out overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/30 to-yellow-100/30 rounded-full transform translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-100/20 to-purple-100/20 rounded-full transform -translate-x-16 translate-y-16 group-hover:scale-110 transition-transform duration-700"></div>
        
        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                  Assigned Teacher
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full mt-1 animate-slide-in"></div>
              </div>
            </div>
            
            {canEdit && (
              <button
                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                className="group/btn relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-2 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </>
                  )}
                </div>
              </button>
            )}
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-6 animate-fade-in-up">
              {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl animate-shake">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 font-medium text-sm">{error}</span>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <label htmlFor="teacherName" className="block text-sm font-semibold text-purple-700 mb-2">
                  Teacher Name
                </label>
                <input
                  id="teacherName"
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full p-4 bg-white border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 placeholder-purple-300 text-purple-800 font-medium shadow-sm hover:shadow-md"
                  placeholder="Enter teacher name"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-yellow-500/5 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleUpdate}
                  disabled={updateLoading || !teacherName.trim()}
                  className="group/save flex-1 relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-purple-300 disabled:to-purple-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:shadow-sm transform hover:scale-105 disabled:scale-100 transition-all duration-300 ease-out overflow-hidden disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover/save:opacity-20 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    {updateLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Save Changes</span>
                      </>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={handleCancel}
                  disabled={updateLoading}
                  className="flex-1 sm:flex-none bg-white hover:bg-purple-50 text-purple-600 hover:text-purple-700 font-semibold py-3 px-6 rounded-xl border-2 border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {teacher?.name ? teacher.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-2">
                      {teacher?.name || 'No teacher assigned'}
                    </h3>
                    {!teacher?.name && (
                      <p className="text-purple-600">
                        {canEdit ? 'Click "Edit" to assign a teacher' : 'No teacher has been assigned yet'}
                      </p>
                    )}
                  </div>
                </div>
                
                {teacher?.updatedAt && (
                  <div className="mt-6 pt-4 border-t border-purple-100">
                    <div className="flex items-center space-x-2 text-purple-600">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">
                        Last updated: {new Date(teacher.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
      </div>

      <style >{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { width: 0; }
          to { width: 4rem; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.8s ease-out 0.3s both;
        }
        
        .animate-shake {
          animation: shake 0.4s ease-out;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};