import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChildProfileBase } from '../ChildProfileBase';
import { getAuthToken } from '../../utils/authHelper';
import type { ChildData } from '../../types/child';

export const ParentChildProfile: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
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
      if (!token) throw new Error('Authentication required - please log in');

      console.log('Raw token:', token);

      // Extract parent ID from token payload
      let parentId: string | null = null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', payload);
        
        // Get parent ID - use both id and _id for compatibility
        parentId = payload.id || payload._id || null;
        
        // Additional validations
        if (payload.role !== 'parent') {
          throw new Error('Access denied - parent role required');
        }
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          throw new Error('Session expired - please log in again');
        }
      } catch (tokenError) {
        console.error('Token decoding error:', tokenError);
        throw new Error('Invalid token format');
      }

      // Final validation
      if (!parentId || parentId === 'undefined') {
        console.error('Parent ID not found in token');
        throw new Error('Parent identification failed - please log in again');
      }

      console.log('Using parent ID:', parentId);
      
      const response = await axios.get(`https://mama-shule.onrender.com/api/children/my-children`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('API Response:', response.data);
      
      // Handle different response formats
      const childrenData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.children || [];
      
      if (!Array.isArray(childrenData)) {
        throw new Error('Invalid data format received from server');
      }

      setState({
        loading: false,
        error: '',
        childData: childrenData[0] || null,
        multipleChildren: childrenData
      });

    } catch (err) {
      console.error('Full error details:', err);
      
      let errorMessage = 'Failed to fetch child data';
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timeout - please check your connection';
        } else if (status === 401) {
          errorMessage = 'Authentication failed - please log in again';
        } else if (status === 403) {
          errorMessage = 'Access denied - insufficient permissions';
        } else if (status === 404) {
          errorMessage = 'Service not found - please contact support';
        } else if (status && status >= 500) {
          errorMessage = 'Server error - please try again later';
        } else {
          errorMessage = err.response?.data?.message || err.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
    }
  };

  fetchData();
}, []);

  // Enhanced loading state with retry option
  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-32 bg-gradient-to-br from-purple-50 to-yellow-50 rounded-2xl shadow-lg border border-purple-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-purple-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-purple-700 font-medium text-sm md:text-base animate-pulse">
            Loading child information...
          </p>
        </div>
      </div>
    );
  }

  // Enhanced error state with retry functionality
  if (state.error) {
    return (
      <div className="bg-gradient-to-r from-red-50 via-purple-50 to-yellow-50 border-l-4 border-red-400 p-4 md:p-6 rounded-xl shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-red-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3 md:ml-4 flex-1">
            <p className="text-red-800 font-semibold text-base md:text-lg">Error</p>
            <p className="text-red-600 mt-1 text-sm md:text-base break-words">{state.error}</p>
            <button
              onClick={() => {
                setState(prev => ({ ...prev, loading: true, error: '' }));
                // Trigger re-render to restart useEffect
                window.location.reload();
              }}
              className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ChildProfileBase
      {...state}
      compact={compact}
      title="My Child"
      requiredRole="parent"
    >
      {({ childData, multipleChildren, compact }) => (
        <div className={`
          bg-gradient-to-br from-purple-50 via-white to-yellow-50 
          rounded-2xl shadow-xl border border-purple-100
          transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]
          ${compact ? 'p-3 md:p-4 space-y-3' : 'p-4 md:p-6 space-y-4 md:space-y-6'}
        `}>
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            @keyframes reverse {
              from {
                transform: rotate(360deg);
              }
              to {
                transform: rotate(0deg);
              }
            }
            
            .animate-fade-in-up {
              animation: fadeInUp 0.6s ease-out forwards;
              opacity: 0;
            }
            
            .animate-fade-in {
              animation: fadeIn 0.8s ease-out forwards;
            }
            
            .animate-reverse {
              animation: reverse 1s linear infinite;
            }
          `}</style>
          
          {multipleChildren.length > 1 ? (
            <div className="space-y-4 md:space-y-6">
              <div className="text-center">
                <h3 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent">
                  My Children
                </h3>
                <div className="w-16 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-purple-400 to-yellow-400 rounded-full mx-auto mt-2"></div>
              </div>
              
              <div className={`
                grid gap-3 md:gap-4 transition-all duration-300
                ${compact ? 
                  'grid-cols-1 sm:grid-cols-2' : 
                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }
              `}>
                {multipleChildren.map((child, index) => (
                  <div
                    key={child._id}
                    className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50 
                              rounded-xl border-2 border-purple-100 p-4 md:p-5 transition-all duration-300 
                              hover:border-yellow-300 hover:shadow-lg hover:scale-105
                              transform animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-200 to-purple-200 
                                   rounded-full -translate-y-8 md:-translate-y-10 translate-x-8 md:translate-x-10 opacity-20 group-hover:opacity-30 
                                   transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-yellow-400 
                                       rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm md:text-lg">
                            {child.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      
                      <h4 className="font-bold text-base md:text-lg text-purple-800 mb-2 group-hover:text-purple-900 
                                    transition-colors duration-200 truncate">
                        {child.name}
                      </h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-purple-600">
                          <span className="text-xs md:text-sm font-medium">Age:</span>
                          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs md:text-sm font-semibold">
                            {child.age}
                          </span>
                        </div>
                        
                        <div className="text-xs text-purple-400 font-mono bg-purple-50 px-2 py-1 rounded truncate">
                          ID: {child._id}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : childData ? (
            <div className="space-y-4 md:space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-400 to-yellow-400 
                               rounded-full flex items-center justify-center shadow-lg mx-auto mb-4
                               transform transition-transform duration-300 hover:scale-110">
                  <span className="text-white font-bold text-xl md:text-2xl">
                    {childData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-yellow-600 
                              bg-clip-text text-transparent">
                  {childData.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl p-3 md:p-4 
                               border border-purple-200 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-purple-600 text-xs md:text-sm font-medium">Name</p>
                      <p className={`font-bold text-purple-800 truncate ${compact ? 'text-sm md:text-base' : 'text-base md:text-lg'}`}>
                        {childData.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-xl p-3 md:p-4 
                               border border-yellow-200 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-yellow-600 text-xs md:text-sm font-medium">Age</p>
                      <p className={`font-bold text-yellow-800 ${compact ? 'text-sm md:text-base' : 'text-base md:text-lg'}`}>
                        {childData.age} years old
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 md:py-12 animate-fade-in">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-200 to-yellow-200 
                             rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-10 h-10 md:w-12 md:h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-purple-400 text-base md:text-lg font-medium">
                No children found
              </p>
              <p className="text-purple-300 text-xs md:text-sm mt-2">
                Children will appear here once they're added to your account
              </p>
            </div>
          )}
        </div>
      )}
    </ChildProfileBase>
  );
};