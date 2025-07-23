import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const CreateAnnouncement = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://mama-shule.onrender.com/api/announcements', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/announcements');
    } catch (err) {
      setError('Failed to create announcement. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4 md:p-8"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-purple-800 mb-2">Create New Announcement</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full"></div>
        </motion.div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-6 bg-red-100 text-red-700 rounded-lg shadow-md"
          >
            {error}
          </motion.div>
        )}
        
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-xl shadow-lg p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-2">
            <label className="block text-purple-700 font-medium">Title</label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <input
                type="text"
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                maxLength={100}
                placeholder="Enter announcement title"
              />
            </motion.div>
            <p className="text-xs text-gray-500 text-right">{formData.title.length}/100 characters</p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-purple-700 font-medium">Content</label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <textarea
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                maxLength={1000}
                placeholder="Write your announcement details here..."
              />
            </motion.div>
            <p className="text-xs text-gray-500 text-right">{formData.content.length}/1000 characters</p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-purple-700 font-medium">Priority</label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <select
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none bg-white"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="low" className="text-green-600">Low Priority</option>
                <option value="medium" className="text-yellow-600">Medium Priority</option>
                <option value="high" className="text-red-600">High Priority</option>
              </select>
            </motion.div>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
            <motion.button
              type="button"
              onClick={() => navigate('/announcements')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
                isSubmitting 
                  ? 'bg-purple-400' 
                  : 'bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 shadow-lg'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Posting...
                </span>
              ) : (
                'Post Announcement'
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
};