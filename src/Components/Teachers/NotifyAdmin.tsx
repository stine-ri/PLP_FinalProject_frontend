import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Bell, AlertTriangle, CheckCircle, Info, AlertOctagon, Mail, Clock, 
  Loader2, Send, RefreshCw, Inbox, Check, BookOpen, UserCheck, 
  ClipboardList, Cpu, AlertCircle 
} from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  priority: string;
  category: string;
  createdAt: string;
  isRead?: boolean;
}

const NotifyAdmin: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium',
    category: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      await axios.post('https://mama-shule.onrender.com/api/notifications/admin', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Notification sent to admins successfully!');
      setFormData({
        title: '',
        message: '',
        priority: 'medium',
        category: 'general'
      });
      
      fetchNotifications();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to send notification');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('https://mama-shule.onrender.com/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://mama-shule.onrender.com/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertOctagon className="w-4 h-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'behavior':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'attendance':
        return <ClipboardList className="w-4 h-4 text-orange-600" />;
      case 'system':
        return <Cpu className="w-4 h-4 text-gray-600" />;
      default:
        return <Mail className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
          <Bell className="w-6 h-6 text-yellow-600" />
          Notify School Administration
        </h1>
      </div>

      {/* Notification Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
        <h2 className="text-lg font-semibold text-purple-700 mb-4">Create New Notification</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full rounded-lg border border-purple-200 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Notification title"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full rounded-lg border border-purple-200 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
              placeholder="Detailed message..."
              required
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full rounded-lg border border-purple-200 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-800 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full rounded-lg border border-purple-200 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="behavior">Behavior</option>
                <option value="attendance">Attendance</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-colors ${
                loading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Notification
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Sent Notifications History */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-purple-700">Notification History</h2>
          <button 
            onClick={fetchNotifications}
            className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
        
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Inbox className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">No notifications sent yet</p>
            <p className="text-sm text-gray-400">Notifications you send will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div 
                key={notification._id} 
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  notification.isRead ? 'bg-gray-50 border-gray-200' : 
                  notification.priority === 'high' ? 'border-red-200 bg-red-50' :
                  notification.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${
                        notification.isRead ? 'text-gray-700' : 'text-purple-800'
                      }`}>
                        {notification.title}
                      </h3>
                      <span className="flex items-center gap-1 text-xs">
                        {getPriorityIcon(notification.priority)}
                        {notification.priority}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      notification.isRead ? 'text-gray-600' : 'text-gray-700'
                    }`}>
                      {notification.message}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-white rounded-full flex items-center gap-1 shadow-sm">
                        {getCategoryIcon(notification.category)}
                        {notification.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end min-w-[120px]">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="mt-2 px-3 py-1 bg-white text-purple-700 text-xs rounded-lg border border-purple-200 hover:bg-purple-50 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotifyAdmin;