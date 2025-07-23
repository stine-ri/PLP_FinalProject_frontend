import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

interface Student {
  _id: string;
  name: string;
  classLevel: string;
  parentId?: {
    _id: string;
    name: string;
    email?: string;
  };
  teacherId?: {
    _id: string;
    name: string;
    email?: string;
  };
  results?: Array<{
    term: string;
    subject: string;
    score: number;
  }>;
  attendance?: Array<{
    date: string;
    status: 'Present' | 'Absent' | 'Late';
  }>;
  feeStatus?: {
    paid: boolean;
    amountDue: number;
  };
}

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);

  // Fetch students based on user role
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setUserRole(role);

    const fetchStudents = async () => {
      try {
        let url = 'http://localhost:5000/api/students/';
        if (role === 'teacher') {
          url += 'teacher';
        } else if (role === 'parent') {
          url += 'parent';
        } else if (role === 'admin') {
          url = 'http://localhost:5000/api/students';
        } else {
          throw new Error('Unauthorized access');
        }

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Apply filters when search term or class filter changes
  useEffect(() => {
    let results = students;
    
    if (searchTerm) {
      results = results.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.classLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.teacherId?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (classFilter) {
      results = results.filter(student =>
        student.classLevel === classFilter
      );
    }

    setFilteredStudents(results);
  }, [searchTerm, classFilter, students]);

  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.error || 'Failed to fetch students');
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unknown error occurred');
    }
  };

  const toggleStudentDetails = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const calculateAverageScore = (results: Student['results']) => {
    if (!results || results.length === 0) return 'N/A';
    const sum = results.reduce((total, result) => total + result.score, 0);
    return (sum / results.length).toFixed(2);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Class', 'Parent', 'Teacher', 'Average Score', 'Fee Status'];
    const csvData = [
      headers.join(','),
      ...filteredStudents.map(student => [
        `"${student.name}"`,
        `"${student.classLevel}"`,
        `"${student.parentId?.name || 'N/A'}"`,
        `"${student.teacherId?.name || 'N/A'}"`,
        calculateAverageScore(student.results),
        student.feeStatus?.paid ? 'Paid' : 'Unpaid'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `students_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      setImportFile(acceptedFiles[0]);
    }
  });

  const handleBulkImport = async () => {
    if (!importFile) return;

    try {
      setImportProgress(0);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', importFile);

      await axios.post('http://localhost:5000/api/students/import', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setImportProgress(percentCompleted);
          }
        }
      });

      // Refresh student list after import
      const response = await axios.get('http://localhost:5000/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      setFilteredStudents(response.data);
      setShowImportModal(false);
      setImportFile(null);
    } catch (err) {
      handleError(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-red-100 text-red-700 rounded-md"
      >
        <p>Error: {error}</p>
        <button 
          onClick={() => setError('')}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
        >
          Dismiss
        </button>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-yellow-500 bg-clip-text text-transparent">
          Students List
        </h2>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Search Input */}
          <motion.div whileHover={{ scale: 1.02 }} className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </motion.div>

          {/* Class Filter */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-4 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">All Classes</option>
              {Array.from(new Set(students.map(s => s.classLevel))).map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </motion.div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToCSV}
            className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg shadow-md hover:from-yellow-500 hover:to-yellow-600 transition-all"
          >
            Export to CSV
          </motion.button>

          {/* Import Button (Admin only) */}
          {userRole === 'admin' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-purple-700 transition-all"
            >
              Bulk Import
            </motion.button>
          )}
        </div>
      </motion.div>

      {filteredStudents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-6 text-center"
        >
          <p className="text-gray-500">No students found matching your criteria</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchTerm('');
              setClassFilter('');
            }}
            className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            Clear Filters
          </motion.button>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-lg p-4 hidden md:block">
            <div className="grid grid-cols-12 gap-2 font-medium text-purple-800">
              <div className="col-span-4">Name</div>
              <div className="col-span-2">Class</div>
              <div className="col-span-3">Parent</div>
              <div className="col-span-2">Average</div>
              <div className="col-span-1">Status</div>
            </div>
          </div>

          <AnimatePresence>
            {filteredStudents.map((student) => (
              <motion.div
                key={student._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Student Summary Row */}
                <motion.div 
                  className="p-4 cursor-pointer grid grid-cols-2 md:grid-cols-12 gap-2 items-center hover:bg-purple-50 transition-colors"
                  onClick={() => toggleStudentDetails(student._id)}
                  whileHover={{ backgroundColor: 'rgba(237, 233, 254, 0.5)' }}
                >
                  <div className="col-span-1 md:col-span-4 font-semibold text-purple-700">
                    {student.name}
                  </div>
                  <div className="col-span-1 md:col-span-2 text-sm text-purple-600">
                    {student.classLevel}
                  </div>
                  <div className="hidden md:block col-span-3 text-sm text-purple-800">
                    {student.parentId?.name || 'N/A'}
                  </div>
                  <div className="hidden md:block col-span-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {calculateAverageScore(student.results)}%
                    </span>
                  </div>
                  <div className="hidden md:block col-span-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      student.feeStatus?.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.feeStatus?.paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  <div className="md:hidden text-right text-purple-500">
                    {expandedStudent === student._id ? '▲' : '▼'}
                  </div>
                </motion.div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedStudent === student._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-purple-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3 text-purple-700 border-b border-purple-100 pb-2">Details</h4>
                            <div className="space-y-2 text-sm">
                              <p className="flex">
                                <span className="font-semibold text-purple-600 w-24">Teacher:</span> 
                                <span>{student.teacherId?.name || 'N/A'}</span>
                              </p>
                              <p className="flex">
                                <span className="font-semibold text-purple-600 w-24">Parent:</span> 
                                <span>{student.parentId?.name || 'N/A'}</span>
                              </p>
                              <p className="flex">
                                <span className="font-semibold text-purple-600 w-24">Parent Email:</span> 
                                <span>{student.parentId?.email || 'N/A'}</span>
                              </p>
                              {student.feeStatus && (
                                <p className="flex">
                                  <span className="font-semibold text-purple-600 w-24">Fee Status:</span> 
                                  <span className={student.feeStatus.paid ? 'text-green-600' : 'text-red-600'}>
                                    {student.feeStatus.paid ? 'Paid' : 'Unpaid'} (${student.feeStatus.amountDue})
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3 text-purple-700 border-b border-purple-100 pb-2">Recent Results</h4>
                            {student.results && student.results.length > 0 ? (
                              <ul className="space-y-2 text-sm">
                                {student.results.slice(0, 3).map((result, index) => (
                                  <li key={index} className="flex justify-between">
                                    <span className="font-medium text-purple-600">{result.subject}:</span>
                                    <span className="font-medium">{result.score}%</span>
                                    <span className="text-gray-500">({result.term})</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">No results available</p>
                            )}
                          </div>
                        </div>

                        {userRole === 'teacher' && (
                          <div className="mt-6 flex flex-wrap gap-2">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors"
                            >
                              Add Result
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition-colors"
                            >
                              Record Attendance
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-yellow-500 text-white rounded-lg text-sm hover:from-purple-600 hover:to-yellow-600 transition-all"
                            >
                              Send Message
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4 text-purple-700">Bulk Import Students</h3>
              
              <div {...getRootProps()} className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center cursor-pointer mb-4 hover:bg-purple-50 transition-colors">
                <input {...getInputProps()} />
                {importFile ? (
                  <p className="text-sm font-medium text-purple-700">{importFile.name}</p>
                ) : (
                  <>
                    <p className="mb-2 text-purple-600">Drag & drop a CSV file here</p>
                    <p className="text-xs text-purple-400">or click to select file</p>
                    <p className="mt-2 text-xs text-gray-500">Supports .csv, .xls, .xlsx formats</p>
                  </>
                )}
              </div>

              {importProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-yellow-500 h-2.5 rounded-full" 
                    initial={{ width: 0 }}
                    animate={{ width: `${importProgress}%` }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowImportModal(false);
                    setImportFile(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBulkImport}
                  disabled={!importFile}
                  className={`px-4 py-2 rounded-lg text-white ${
                    !importFile ? 'bg-purple-400' : 'bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600'
                  } transition-all`}
                >
                  Import
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentsList;