import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

interface Class {
  _id: string;
  name: string;
}

interface Attachment {
  url: string;
  name: string;
  type: string;
}

interface Homework {
  _id?: string;
  classId: string;
  subject: string;
  title: string;
  description: string;
  teacherId?: string;
  dueDate: string;
  
  attachments?: Attachment[];
}

export const HomeworkForm: React.FC<{ 
  classId?: string;
  existingHomework?: Homework;
  onSuccess?: () => void;
}> = ({ classId, existingHomework, onSuccess }) => {
  const [formData, setFormData] = useState<Homework>({
    classId: classId || '',
    subject: 'Math',
    title: '',
    description: '',
    dueDate: ''
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 5,
    onDrop: (acceptedFiles: File[]) => {
      setAttachments(prev => [...prev, ...acceptedFiles]);
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (existingHomework) {
      setFormData(existingHomework);
    }

    const fetchClasses = async () => {
      try {
        let url = 'http://localhost:5000/api/classes';
        if (role === 'teacher') {
          const teacherId = localStorage.getItem('userId');
          url += `?teacherId=${teacherId}`;
        }

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClasses(response.data);

        if (!classId && response.data.length > 0) {
          setFormData(prev => ({ ...prev, classId: response.data[0]._id }));
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch classes');
        } else {
          setError('Failed to fetch classes');
        }
      }
    };

    fetchClasses();
  }, [classId, existingHomework]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      // First upload attachments if any
      let uploadedAttachments: Attachment[] = [];
      if (attachments.length > 0) {
        const uploadFormData = new FormData();
        attachments.forEach(file => {
          uploadFormData.append('files', file);
        });

        const uploadResponse = await axios.post('http://localhost:5000/api/uploads', uploadFormData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        uploadedAttachments = uploadResponse.data;
      }

      // Then save homework with attachment references
      const homeworkData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        attachments: uploadedAttachments
      };

      if (existingHomework) {
        await axios.put(`http://localhost:5000/api/homework/${existingHomework._id}`, homeworkData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/homework', homeworkData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (onSuccess) onSuccess();
      if (!existingHomework) {
        setFormData({
          classId: classId || classes[0]?._id || '',
          subject: 'Math',
          title: '',
          description: '',
          dueDate: ''
        });
        setAttachments([]);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to save homework');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save homework');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {existingHomework ? 'Edit Homework' : 'Assign New Homework'}
      </h2>
      
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!classId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Homework title"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm"
            rows={4}
            placeholder="Detailed instructions..."
            required
            maxLength={1000}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm"
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
          <div 
            {...getRootProps()} 
            className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:border-blue-500"
          >
            <input {...getInputProps()} />
            <p>Drag & drop files here, or click to select files</p>
            <p className="text-xs text-gray-500">(PDF, Word, Images - max 5 files)</p>
          </div>
          
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
                  <button 
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {existingHomework && (
            <button
              type="button"
              onClick={onSuccess}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {existingHomework ? 'Updating...' : 'Assigning...'}
              </span>
            ) : (
              existingHomework ? 'Update Homework' : 'Assign Homework'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};