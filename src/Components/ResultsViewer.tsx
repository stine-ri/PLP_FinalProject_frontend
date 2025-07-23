import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Student {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
}

interface Result {
  _id: string;
  studentId: Student;
  subject: string;
  marks: number;
  term: string;
  year: number;
  teacherId: Teacher;
  classId: string;
}

export const ResultsViewer: React.FC<{ classId?: string }> = ({ classId }) => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    term: '',
    year: '',
    subject: ''
  });
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Result>>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setUserRole(role);

    const fetchResults = async () => {
      try {
        let url = 'https://mama-shule.onrender.com/api/results';
        if (classId) {
          url += `https://mama-shule.onrender.com/${classId}`;
        }

        const params = new URLSearchParams();
        if (filters.term) params.append('term', filters.term);
        if (filters.year) params.append('year', filters.year);
        if (filters.subject) params.append('subject', filters.subject);

        const response = await axios.get(`${url}?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setResults(Array.isArray(response.data) ? response.data : []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      }
      setLoading(false);
    };

    fetchResults();
  }, [classId, filters]);

  const handleEdit = (result: Result) => {
    setIsEditing(result._id);
    setEditData({
      marks: result.marks,
      term: result.term,
      year: result.year
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://mama-shule.onrender.com/api/results/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setResults(results.map(result => 
        result._id === id ? { ...result, ...editData } : result
      ));
      setIsEditing(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://mama-shule.onrender.com/api/results/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResults(results.filter(result => result._id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center h-64"
    >
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-purple-200 rounded-full mb-4"></div>
        <div className="h-4 bg-purple-100 rounded w-32"></div>
      </div>
    </motion.div>
  );

  if (error) return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="p-6 bg-red-50 rounded-lg border border-red-200 text-red-600"
    >
      {error}
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <motion.h2 
          whileHover={{ scale: 1.02 }}
          className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent"
        >
          Results Dashboard
        </motion.h2>
        
        {/* Filters */}
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <select
            value={filters.term}
            onChange={(e) => setFilters({...filters, term: e.target.value})}
            className="rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="">All Terms</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
          
          <select
            value={filters.year}
            onChange={(e) => setFilters({...filters, year: e.target.value})}
            className="rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="">All Years</option>
            {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <select
            value={filters.subject}
            onChange={(e) => setFilters({...filters, subject: e.target.value})}
            className="rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="">All Subjects</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
          </select>
        </motion.div>
      </div>

      {results.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="p-8 text-center bg-white rounded-xl shadow-inner"
        >
          <div className="text-purple-400 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">No results found matching your criteria</p>
        </motion.div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-sm border border-purple-100">
          <table className="min-w-full divide-y divide-purple-100">
            <thead className="bg-gradient-to-r from-purple-50 to-yellow-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Year</th>
                {userRole !== 'parent' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Teacher</th>
                )}
                {(userRole === 'teacher' || userRole === 'admin') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-purple-800 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-50">
              {results.map((result, index) => (
                <motion.tr 
                  key={result._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-purple-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900">
                    {result.studentId?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {result.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {isEditing === result._id ? (
                      <input
                        type="number"
                        value={editData.marks || 0}
                        onChange={(e) => setEditData({
                          ...editData,
                          marks: parseInt(e.target.value)
                        })}
                        className="w-20 border border-purple-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                        min="0"
                        max="100"
                      />
                    ) : (
                      <span className={`font-bold ${
                        result.marks >= 70 ? 'text-green-600' : 
                        result.marks >= 50 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {result.marks}%
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {isEditing === result._id ? (
                      <select
                        value={editData.term || ''}
                        onChange={(e) => setEditData({
                          ...editData,
                          term: e.target.value
                        })}
                        className="border border-purple-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                      >
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                      </select>
                    ) : (
                      result.term
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {isEditing === result._id ? (
                      <input
                        type="number"
                        value={editData.year || new Date().getFullYear()}
                        onChange={(e) => setEditData({
                          ...editData,
                          year: parseInt(e.target.value)
                        })}
                        className="w-24 border border-purple-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-purple-300 focus:outline-none"
                      />
                    ) : (
                      result.year
                    )}
                  </td>
                  {userRole !== 'parent' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {result.teacherId?.name || 'N/A'}
                    </td>
                  )}
                  {(userRole === 'teacher' || userRole === 'admin') && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {isEditing === result._id ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdate(result._id)}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs shadow-md hover:bg-green-600 transition-colors"
                          >
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsEditing(null)}
                            className="px-3 py-1 bg-gray-400 text-white rounded-lg text-xs shadow-md hover:bg-gray-500 transition-colors"
                          >
                            Cancel
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEdit(result)}
                            className="px-3 py-1 bg-purple-500 text-white rounded-lg text-xs shadow-md hover:bg-purple-600 transition-colors"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(result._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs shadow-md hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </motion.button>
                        </>
                      )}
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Result Form (for teachers/admins) */}
      {(userRole === 'teacher' || userRole === 'admin') && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-purple-100"
        >
          <h3 className="text-lg font-medium text-purple-800 mb-4">Add New Result</h3>
          <AddResultForm classId={classId} onSuccess={(newResult) => {
            setResults([...results, newResult]);
          }} />
        </motion.div>
      )}
    </motion.div>
  );
};

// Add Result Form Component (styled to match)
const AddResultForm: React.FC<{ classId?: string; onSuccess: (result: Result) => void }> = ({ 
  classId, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    studentId: '',
    subject: 'Math',
    marks: 0,
    term: 'Term 1',
    year: new Date().getFullYear(),
    classId: classId || ''
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/classes/${classId}/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(response.data);
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, studentId: response.data[0]._id }));
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      }
    };

    if (classId) fetchStudents();
  }, [classId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/results', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess(response.data);
      setFormData({
        studentId: students[0]?._id || '',
        subject: 'Math',
        marks: 0,
        term: 'Term 1',
        year: new Date().getFullYear(),
        classId: classId || ''
      });
      setError('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to add result');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add result');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-red-50 text-red-600 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Student</label>
          <select
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          >
            {students.map(student => (
              <option key={student._id} value={student._id}>{student.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Subject</label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          >
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Marks (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.marks}
            onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Term</label>
          <select
            value={formData.term}
            onChange={(e) => setFormData({ ...formData, term: e.target.value })}
            className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          >
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Year</label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            required
          />
        </div>
        
        {!classId && (
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Class ID</label>
            <input
              type="text"
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
              required
            />
          </div>
        )}
      </div>
      
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={`px-6 py-2 rounded-lg text-white font-medium shadow-md ${
          loading ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-500 to-yellow-500 hover:from-purple-600 hover:to-yellow-600'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Add Result'
        )}
      </motion.button>
    </form>
  );
};