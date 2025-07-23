import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  date: string;
  priority: string;
  author: {
    name: string;
    email: string;
  };
}

export const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Get user role from localStorage (as per your existing auth system)
  const userRole = localStorage.getItem('role');
  
  const canPostAnnouncements = ['teacher', 'admin'].includes(userRole || '');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:5000/api/announcements', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnnouncements(response.data);
      } catch (err) {
        setError('Failed to load announcements');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleCreateClick = () => {
    navigate('/create-announcement');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-400 shadow-purple-200';
      case 'medium': return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400 shadow-yellow-200';
      default: return 'bg-gradient-to-br from-white to-purple-50 border-purple-300 shadow-purple-100';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-purple-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-purple-300 text-purple-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-yellow-200 border-b-yellow-500 rounded-full animate-spin animation-delay-300"></div>
            </div>
            <p className="text-purple-600 font-medium text-lg animate-pulse">Loading announcements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 animate-fade-in">
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-purple-800 to-yellow-600 bg-clip-text text-transparent">
              Announcements
            </h2>
            <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full animate-slide-in"></div>
          </div>
          
          {canPostAnnouncements && (
            <button 
              onClick={handleCreateClick}
              className="group relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <span className="text-sm sm:text-base">Create Announcement</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-300 rounded-xl shadow-lg animate-shake">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {announcements.length === 0 && !error && (
          <div className="text-center py-12 sm:py-16 animate-fade-in">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-purple-800 mb-2">No announcements available</h3>
            <p className="text-purple-600 max-w-md mx-auto">Check back later for important updates and notifications.</p>
          </div>
        )}

        {/* Announcements Grid */}
        {announcements.length > 0 && (
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div 
                key={announcement._id}
                className={`group relative ${getPriorityColor(announcement.priority)} p-6 sm:p-8 border-l-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up overflow-hidden`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-500"></div>
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-purple-900 group-hover:text-purple-800 transition-colors duration-300">
                        {announcement.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getPriorityBadge(announcement.priority)} shadow-sm`}>
                        {announcement.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-purple-600 bg-white/50 px-3 py-2 rounded-lg shadow-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium whitespace-nowrap">
                      {new Date(announcement.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <p className="text-purple-800 leading-relaxed text-base sm:text-lg">
                    {announcement.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center space-x-2 pt-4 border-t border-purple-200/50">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-semibold text-sm">
                      {(announcement.author?.name || 'Staff').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-purple-700 font-medium text-sm">
                      Posted by: <span className="font-semibold">{announcement.author?.name || 'Staff'}</span>
                    </p>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
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
          to { width: 5rem; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }
        
        .animate-slide-in {
          animation: slide-in 0.8s ease-out 0.3s both;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-out;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};