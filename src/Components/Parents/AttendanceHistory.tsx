import  { useState, useEffect } from 'react';

interface AttendanceRecord {
  _id: string;
  date: string;
  status: string;
  studentId: {
    name: string;
  };
}

export const AttendanceHistory = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/attendance/student/history', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        console.log('Response status:', response.status); // Debug log
        
        if (response.status === 404) {
          throw new Error('Endpoint not found. Please check with administrator.');
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to load attendance history');
        }

        const data = await response.json();
        setAttendance(data);
      } catch (err) {
        console.error('Error:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [token]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'Absent':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'Absent':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
      default:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="bg-gradient-to-br from-purple-50 via-white to-yellow-50 rounded-2xl shadow-lg border border-purple-200/50 p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-yellow-200 border-b-yellow-500 rounded-full animate-spin animation-delay-300"></div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">Loading Attendance History</h3>
              <p className="text-purple-600 animate-pulse">Fetching your attendance records...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg border border-red-200 p-6 sm:p-8 animate-shake">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Attendance</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (attendance.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="bg-gradient-to-br from-purple-50 via-white to-yellow-50 rounded-2xl shadow-lg border border-purple-200/50 p-8">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-purple-800 mb-2">No Records Found</h3>
            <p className="text-purple-600 max-w-md mx-auto">No attendance records are available at this time. Check back later or contact your administrator.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="bg-gradient-to-br from-purple-50 via-white to-yellow-50 rounded-2xl shadow-lg hover:shadow-xl border border-purple-200/50 transition-all duration-500 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-white/10 rounded-full transform translate-x-20 -translate-y-20"></div>
          <div className="relative flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Attendance History</h2>
              <p className="text-purple-100">Your attendance record overview</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-6 bg-white/50 backdrop-blur-sm border-b border-purple-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Present', 'Absent', 'Late'].map((status) => {
              const count = attendance.filter(record => record.status === status).length;
              const percentage = ((count / attendance.length) * 100).toFixed(1);
              
              return (
                <div key={status} className="bg-white rounded-xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">{status}</p>
                      <p className="text-2xl font-bold text-purple-800">{count}</p>
                      <p className="text-xs text-purple-500">{percentage}% of total</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-yellow-100 rounded-lg flex items-center justify-center">
                      {getStatusIcon(status)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attendance Records */}
        <div className="p-6 space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
          {attendance.map((record, index) => (
            <div 
              key={record._id}
              className="group relative bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-yellow-50 rounded-xl p-4 sm:p-5 border border-purple-100/50 hover:border-purple-200 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100/30 to-yellow-100/30 rounded-full transform translate-x-10 -translate-y-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-purple-800 text-lg">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-purple-600">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {record.studentId?.name && (
                    <div className="flex items-center space-x-2 ml-13">
                      <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm text-purple-600 font-medium">
                        Student: {record.studentId.name}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border shadow-sm font-semibold text-sm group-hover:scale-105 transition-transform duration-300 ${getStatusColor(record.status)}`}>
                    {getStatusIcon(record.status)}
                    <span>{record.status}</span>
                  </div>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"></div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-purple-100 to-yellow-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-2 text-purple-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium">Total Records: {attendance.length}</span>
            </div>
            <div className="text-sm text-purple-600">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }
        
        .animate-shake {
          animation: shake 0.4s ease-out;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #a855f7 #f3f4f6;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #eab308);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #d97706);
        }
      `}</style>
    </div>
  );
};