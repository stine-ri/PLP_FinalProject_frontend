import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
interface Student {
  _id: string;
  name: string;
}

interface Class {
  _id: string;
  name: string;
}

interface Subject {
  name: string;
  code: string;
}

const ResultsForm: React.FC = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    classId: '',
    subject: 'Math',
    marks: '',
    term: 'Term 1',
    year: new Date().getFullYear().toString()
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

useEffect(() => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const teacherId = localStorage.getItem('userId');
  setUserRole(role);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (!token) {
        setError('Authentication token is missing.');
        return;
      }

      let classesRes;

      if (role === 'teacher') {
        classesRes = await axios.get(`https://mama-shule.onrender.com/api/classes?teacherId=${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClasses(classesRes.data);

        if (classesRes.data.length > 0) {
          const firstClassId = classesRes.data[0]._id;
          setFormData(prev => ({ ...prev, classId: firstClassId }));
          fetchStudents(firstClassId);
        }
      } else if (role === 'admin') {
        classesRes = await axios.get('https://mama-shule.onrender.com/api/classes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(classesRes.data);
      }
    } catch (err) {
     const error = err as AxiosError<{ message: string }>;

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to fetch classes');
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

useEffect(() => {
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://mama-shule.onrender.com/api/subjects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const fetchedSubjects = response.data.subjects || [];

      setSubjects(fetchedSubjects);

      // Set default subject if not already set
      if (fetchedSubjects.length > 0 && !formData.subject) {
        setFormData(prev => ({ ...prev, subject: fetchedSubjects[0].name }));
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(
        error.response?.data?.message || error.message || 'Failed to fetch subjects'
      );
    } finally {
      setLoading(false);
    }
  };

  fetchSubjects();
}, []);

  const fetchStudents = async (classId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://mama-shule.onrender.com/api/classes/${classId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
      if (response.data.length > 0) {
        setFormData(prev => ({ ...prev, studentId: response.data[0]._id }));
      }
    }catch (err) {
  const error = err as AxiosError<{ message: string }>;

  setError(
    error.response?.data?.message || error.message || 'Failed to upload results'
  );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Validate marks
      const marksNum = parseInt(formData.marks);
      if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
        throw new Error('Marks must be between 0 and 100');
      }

      const token = localStorage.getItem('token');
      await axios.post('/api/results', {
        ...formData,
        marks: marksNum,
        year: parseInt(formData.year)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Results uploaded successfully!');
      setFormData({
        ...formData,
        marks: '',
        studentId: students[0]?._id || ''
      });
    } catch (err) {
  const error = err as AxiosError<{ message: string }>;

  setError(
    error.response?.data?.message || error.message || 'Failed to upload results'
  );
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setFormData({ ...formData, classId, studentId: '' });
    fetchStudents(classId);
  };

  if (loading && !students.length) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Student Results</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={formData.classId}
              onChange={handleClassChange}
              className="w-full rounded-md border-gray-300 shadow-sm"
              required
              disabled={!classes.length}
            >
              {classes.length ? (
                classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))
              ) : (
                <option value="">No classes available</option>
              )}
            </select>
          </div>

          {/* Student Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm"
              required
              disabled={!students.length}
            >
              {students.length ? (
                students.map(student => (
                  <option key={student._id} value={student._id}>{student.name}</option>
                ))
              ) : (
                <option value="">No students in this class</option>
              )}
            </select>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              {subjects.map(subject => (
                <option key={subject.code} value={subject.name}>{subject.name}</option>
              ))}
            </select>
          </div>

          {/* Term Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
            <select
              value={formData.term}
              onChange={(e) => setFormData({ ...formData, term: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Term 3">Term 3</option>
            </select>
          </div>

          {/* Year Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm"
              required
              min="2000"
              max="2100"
            />
          </div>

          {/* Marks Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marks (%)</label>
            <input
              type="number"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm"
              required
              min="0"
              max="100"
              placeholder="Enter marks (0-100)"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading || !students.length}
            className={`px-4 py-2 rounded-md text-white ${
              loading || !students.length 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Results'
            )}
          </button>
        </div>
      </form>

      {/* Bulk Upload Option for Admins */}
      {(userRole === 'admin' || userRole === 'teacher') && (
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-medium mb-2">Bulk Upload Results</h3>
          <p className="text-sm text-gray-600 mb-3">
            Upload a CSV file with multiple student results at once.
          </p>
          <BulkResultsUpload 
            classId={formData.classId} 
            onSuccess={() => {
              setSuccess('Bulk results uploaded successfully!');
            }} 
          />
        </div>
      )}
    </div>
  );
};

// Bulk Results Upload Component
const BulkResultsUpload: React.FC<{ classId: string; onSuccess: () => void }> = ({ 
  classId, 
  onSuccess 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !classId) return;

    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('classId', classId);

      const token = localStorage.getItem('token');
      await axios.post('/api/results/bulk', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      onSuccess();
      setFile(null);
      // Clear file input
      const fileInput = document.getElementById('bulkUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
  const error = err as AxiosError<{ message: string }>;

  setError(
    error.response?.data?.message || error.message || 'Failed to upload results'
  );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          CSV File (studentId,subject,marks,term,year)
        </label>
        <input
          id="bulkUpload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={!classId}
        />
        <p className="mt-1 text-xs text-gray-500">
          Download <a href="/templates/results-template.csv" className="text-blue-600">template</a> for reference
        </p>
      </div>

      {file && (
        <div className="flex items-center space-x-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload CSV'}
          </button>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
    </form>
  );
};

export default ResultsForm;