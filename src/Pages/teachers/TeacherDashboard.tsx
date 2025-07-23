import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  BarChart3, 
  ClipboardList, 
  UserCheck, 
  Bell, 
  MessageCircle,
  Calendar,
  Menu,
  X,
  Home,
  ChevronRight,
  PlusCircle,
  FileText,
  Smartphone,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Import your actual components
import {TeacherDashboard as AssignedClasses} from '../../Components/Teachers/AssignedClasses';
import StudentsList from '../../Components/Teachers/StudentList';
import { CreateAnnouncement } from '../../Components/CreateAnnouncement';
import { AssignedTeacher } from '../../Components/Parents/AssignedTeacher';
import { ClassInfo } from '../../Components/ClassInfo';
import { ResultsViewer } from '../../Components/ResultsViewer';
import { AttendanceHistory } from '../../Components/Parents/AttendanceHistory';
import { Announcements } from '../../Components/Parents/Announcements';
import { TeacherDashboard as ImportedTeacherDashboard } from '../../Pages/teachers/Homework';
import Navbar from '../../Components/Navbar';
import SendSMS from "../../Components/SendSMS";
import Messages from '../../Components/Teachers/Messages';
import { logout } from "../../redux/slices/authSlice";
import NotifyAdmin from '../../Components/Teachers/NotifyAdmin';
const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'classes', label: 'My Classes', icon: BookOpen },
    { id: 'students', label: 'Students List', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'grades', label: 'Grades & Results', icon: BarChart3 },
    { id: 'announcements', label: 'Create Announcements', icon: PlusCircle },
    { id: 'notices', label: 'School Notices', icon: Bell },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'notify-admin', label: 'Notify Admin', icon: Bell },
    { id: 'schedule', label: 'Class Schedule', icon: Calendar },
    { id: 'teacher-info', label: 'Teacher Info', icon: FileText },
    { id: 'sms', label: 'Send SMS', icon: Smartphone }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'classes':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">My Assigned Classes</h1>
            <AssignedClasses />
          </div>
        );
      case 'students':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Students Management</h1>
            <StudentsList />
          </div>
        );
      case 'assignments':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Homework & Assignments</h1>
            <ImportedTeacherDashboard />
          </div>
        );
      case 'attendance':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Attendance Management</h1>
            <AttendanceHistory />
          </div>
        );
      case 'grades':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Student Results & Grades</h1>
            <ResultsViewer />
          </div>
        );
      case 'announcements':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Create Announcements</h1>
            <CreateAnnouncement />
          </div>
        );
      case 'notices':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">School Notices</h1>
            <Announcements />
          </div>
        );
      case 'messages':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Messages & Communications</h1>
            <Messages />
          </div>
        );
        
      case 'schedule':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Class Information</h1>
            <ClassInfo />
          </div>
        );
      case 'teacher-info':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Assigned Teacher Information</h1>
            <AssignedTeacher />
          </div>
        );
      
      case 'sms':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Send SMS to Parents</h1>
            <SendSMS
             teacherId={localStorage.getItem("userId")}
             studentId="admin-broadcast"
            />
          </div>
        );
        case 'notify-admin':
  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6 text-purple-800">Notify School Administration</h1>
      <NotifyAdmin />
    </div>
  );
      default:
        return (
          <div className="p-6 lg:p-8 space-y-8">
            <div className="text-center mb-8 lg:mb-12">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl lg:text-4xl xl:text-5xl font-bold text-purple-800 mb-4"
              >
                Welcome to <span className="text-yellow-600">Mamashule</span> Teacher Portal
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-purple-600 text-lg lg:text-xl"
              >
                Manage your classes, students, and teaching activities
              </motion.p>
            </div>
            {/* Quick Stats Section */}
            <div className="mt-12">
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-2xl font-bold text-purple-800 mb-6"
              >
                Quick Overview
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Students', value: '127', icon: GraduationCap, color: 'purple', iconColor: 'yellow-300' },
                  { label: 'Active Classes', value: '8', icon: BookOpen, color: 'yellow', iconColor: 'white' },
                  { label: 'Pending Tasks', value: '23', icon: ClipboardList, color: 'purple', iconColor: 'yellow-300' },
                  { label: 'New Messages', value: '12', icon: MessageCircle, color: 'yellow', iconColor: 'white', action: 'messages' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`bg-gradient-to-br ${
                      stat.color === 'purple' ? 'from-purple-600 to-purple-700' : 'from-yellow-500 to-yellow-600'
                    } p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
                     onClick={() => stat.action && setActiveSection(stat.action)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-${stat.color === 'purple' ? 'purple-200' : 'yellow-100'} text-sm`}>{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 text-${stat.iconColor}`} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quick Action Cards - Teacher focused */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {[
                { id: 'classes', label: 'My Classes', icon: BookOpen, desc: 'Manage your assigned classes and subjects', color: 'purple' },
                { id: 'students', label: 'Student Management', icon: Users, desc: 'View and manage your students information', color: 'yellow' },
                { id: 'assignments', label: 'Assignments', icon: ClipboardList, desc: 'Create and manage homework assignments', color: 'purple' },
                { id: 'attendance', label: 'Attendance Tracker', icon: UserCheck, desc: 'Mark and monitor student attendance records', color: 'yellow' },
                { id: 'grades', label: 'Grade Management', icon: BarChart3, desc: 'Input and track student grades and results', color: 'purple' },
                { id: 'announcements', label: 'Quick Announcement', icon: PlusCircle, desc: 'Create announcements for students and parents', color: 'yellow' }
              ].map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 ${
                    item.color === 'purple' ? 'border-purple-600' : 'border-yellow-500'
                  } hover:shadow-xl transition-all duration-300 cursor-pointer group`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-purple-800">{item.label}</h3>
                    <div className={`w-10 h-10 bg-gradient-to-br ${
                      item.color === 'purple' ? 'from-purple-500 to-purple-700' : 'from-yellow-500 to-yellow-600'
                    } rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-purple-600 text-sm">{item.desc}</p>
                  <div className="flex items-center mt-3 text-yellow-600 font-semibold">
                    <span className="text-sm">View {item.label.split(' ')[0]}</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions Section */}
<motion.div 
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1 }}
  className="mt-12"
>
  <h2 className="text-2xl font-bold text-purple-800 mb-6">Quick Actions</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-r from-purple-50 to-yellow-50 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => setActiveSection('sms')}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-full flex items-center justify-center">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-purple-800">Send SMS</h3>
          <p className="text-purple-600 text-sm">Send messages to students and parents</p>
        </div>
      </div>
    </motion.div>
    
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-r from-yellow-50 to-purple-50 p-6 rounded-xl border border-yellow-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => setActiveSection('messages')}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-full flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-purple-800">Messages</h3>
          <p className="text-purple-600 text-sm">View and send messages</p>
        </div>
      </div>
    </motion.div>

    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-r from-purple-50 to-yellow-50 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => setActiveSection('notify-admin')}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-full flex items-center justify-center">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-purple-800">Notify Admin</h3>
          <p className="text-purple-600 text-sm">Send notifications to administration</p>
        </div>
      </div>
    </motion.div>
  </div>
</motion.div>

            {/* Quick Actions Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-purple-800 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-purple-50 to-yellow-50 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveSection('sms')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-full flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-purple-800">Send SMS</h3>
                      <p className="text-purple-600 text-sm">Send messages to students and parents</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-yellow-50 to-purple-50 p-6 rounded-xl border border-yellow-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  onClick={() => setActiveSection('messages')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-purple-500 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-purple-800">Chat with Teachers</h3>
                      <p className="text-purple-600 text-sm">Communicate with other teachers</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        );
    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50">
    {/* Fixed Navbar at the top */}
    <div className="fixed top-0 left-0 right-0 z-50">
      <Navbar />
    </div>
    
    {/* Main layout with proper top margin */}
    <div className="pt-20 flex min-h-screen">
      {/* Sidebar */}
      <div className={`fixed top-20 bottom-0 left-0 z-40 w-64 bg-gradient-to-b from-purple-800 to-purple-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:top-0 lg:bottom-0 lg:w-72 overflow-y-auto`}>
        <div className="flex items-center justify-between p-4 border-b border-purple-700 lg:hidden">
          <h2 className="text-lg font-semibold text-white">Teaching Tools</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-purple-700 text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-6 h-[calc(100vh-7rem)] pb-6 overflow-y-auto">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-4 mb-3 rounded-lg text-left transition-all duration-300 transform hover:scale-105 group ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-purple-900 shadow-lg font-semibold'
                    : 'text-white hover:bg-purple-700 hover:text-yellow-200'
                }`}
              >
                <Icon className={`w-5 h-5 group-hover:scale-110 transition-transform duration-200 ${
                  activeSection === item.id ? 'text-purple-800' : ''
                }`} />
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto text-purple-800" />
                )}
              </motion.button>
            );
          })}
          
          {/* Logout Button - Added at the bottom of the sidebar */}
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: menuItems.length * 0.05 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-4 mt-6 rounded-lg text-left transition-all duration-300 transform hover:scale-105 group bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </nav>
      </div>
      
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 inset-x-0 bottom-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-0 lg:pl-6">
        {/* Mobile menu button */}
        <div className="lg:hidden p-6 bg-white shadow-sm">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(true)}
            className="p-3 rounded-lg hover:bg-purple-50 text-purple-700 border border-purple-200 transition-colors duration-200"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Content area */}
        <div className="min-h-screen px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default TeacherDashboard;