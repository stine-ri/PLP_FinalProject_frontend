import React, { useState, useEffect } from 'react';
import { HomeworkForm } from './HomeworkForm';

interface Class {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
}

interface Attachment {
  url: string;
  name: string;
  type: string;
}

interface Homework {
  _id: string;
  classId: Class;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  teacherId: Teacher;
  attachments?: Attachment[];
}



export const HomeworkList: React.FC<{ classId?: string }> = ({ classId }) => {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    subject: '',
    status: 'upcoming' // 'upcoming' or 'past'
  });
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setUserRole(role);

    const fetchHomework = async () => {
      try {
        let url = 'https://mama-shule.onrender.com/api/homework';
        if (classId) {
          url += `https://mama-shule.onrender.com/${classId}`;
        }

        const params = new URLSearchParams();
        if (filters.subject) params.append('subject', filters.subject);
        if (filters.status === 'upcoming') params.append('upcoming', 'true');

        const response = await fetch(`${url}?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        setHomework(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch homework');
      } finally {
        setLoading(false);
      }
    };

    fetchHomework();
  }, [classId, filters]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this homework assignment?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://mama-shule.onrender.com/api/homework/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setHomework(homework.filter(hw => hw._id !== id));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete homework');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete homework');
    }
  };

  const handleUpdateSuccess = async () => {
    setEditingId(null);
    // Refetch homework
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://mama-shule.onrender.com/api/homework${classId ? `/${classId}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setHomework(data);
    } catch (err: unknown) {
  if (err instanceof Error) {
    console.error('Error:', err.message);
    setError(err.message);
  } else {
    console.error('Unknown error:', err);
    setError('An unexpected error occurred.');
  }
}

  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📋';
    return '📎';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateColor = (dueDate: string) => {
    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) return 'bg-gray-100 text-gray-600';
    if (daysUntil <= 1) return 'bg-red-100 text-red-700 border border-red-200';
    if (daysUntil <= 3) return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
    return 'bg-green-100 text-green-700 border border-green-200';
  };

  const getDueDateText = (dueDate: string) => {
    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) return 'Overdue';
    if (daysUntil === 0) return 'Due Today';
    if (daysUntil === 1) return 'Due Tomorrow';
    return `${daysUntil} days left`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
          <p className="text-purple-700 font-medium">Loading homework assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent mb-2">
            Homework Assignments
          </h1>
          <p className="text-purple-600 text-lg">Track and manage your academic tasks</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg animate-shake">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="ml-3 text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Add/Edit Form at top when editing */}
        {editingId === 'new' && (
          <div className="mb-8 animate-slide-down">
            <HomeworkForm 
              classId={classId}
              onSuccess={() => {
                setEditingId(null);
                handleUpdateSuccess();
              }}
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-6 mb-8 border border-purple-100 animate-slide-in-up">
          <div className="flex items-center mb-4">
            <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-yellow-400 rounded-full mr-4"></div>
            <h2 className="text-xl font-bold text-gray-800">Filter Assignments</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Subject</label>
              <div className="relative">
                <select
                  value={filters.subject}
                  onChange={(e) => setFilters({...filters, subject: e.target.value})}
                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="">All Subjects</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Status</label>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Homework List */}
        <div className="space-y-6">
          {homework.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Homework Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {filters.subject || filters.status !== 'upcoming' 
                  ? 'Try adjusting your filters to see more assignments.' 
                  : 'No homework assignments have been posted yet.'}
              </p>
            </div>
          ) : (
            homework.map((hw, index) => (
              <div 
                key={hw._id} 
                className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-purple-100 hover:shadow-2xl transition-all duration-300 animate-fade-in-up"
                style={{animationDelay: `${index * 100}ms`}}
              >
                {editingId === hw._id ? (
                  <HomeworkForm 
                    classId={hw.classId._id}
                    existingHomework={{
                      ...hw,
                      classId: hw.classId._id,
                      teacherId: hw.teacherId._id,
                    }}
                    onSuccess={handleUpdateSuccess}
                  />
                ) : (
                  <>
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex-1 mb-4 lg:mb-0">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{hw.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-purple-700 font-medium">Class: {hw.classId.name}</span>
                          </div>
                          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="text-yellow-700 font-medium">Subject: {hw.subject}</span>
                          </div>
                          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span className="text-blue-700 font-medium">Teacher: {hw.teacherId.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Due Date Badge */}
                      <div className="flex-shrink-0">
                        <div className={`px-4 py-2 rounded-xl text-sm font-semibold ${getDueDateColor(hw.dueDate)}`}>
                          <div className="text-center">
                            <div className="font-bold">{getDueDateText(hw.dueDate)}</div>
                            <div className="text-xs opacity-75">
                              {new Date(hw.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-xl border-l-4 border-purple-300">
                      <p className="text-gray-700 leading-relaxed">{hw.description}</p>
                    </div>
                    
                    {/* Attachments */}
                    {hw.attachments && hw.attachments.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          Attachments
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {hw.attachments.map((file, index) => (
                            <a 
                              key={index}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-3 bg-white border border-purple-100 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
                            >
                              <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-200">
                                {getFileIcon(file.type)}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{file.type.split('/')[0]} file</p>
                              </div>
                              <svg className="w-4 h-4 text-purple-400 group-hover:text-purple-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                              </svg>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    {(userRole === 'teacher' || userRole === 'admin') && (
                      <div className="flex justify-end space-x-3 pt-4 border-t border-purple-100">
                        <button
                          onClick={() => setEditingId(hw._id)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 transform hover:scale-105"
                        >
                          <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(hw._id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-200 transition-all duration-200 transform hover:scale-105"
                        >
                          <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Floating Add Button */}
        {(userRole === 'teacher' || userRole === 'admin') && !editingId && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setEditingId('new');
              }}
              className="group p-4 bg-gradient-to-r from-purple-600 to-yellow-500 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 focus:ring-4 focus:ring-purple-300"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Add Homework
              </div>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-in-up { animation: slide-in-up 0.8s ease-out; }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out both; }
        .animate-shake { animation: shake 0.5s ease-out; }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};