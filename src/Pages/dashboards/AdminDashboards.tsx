import { useState } from 'react';
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Users, 
  GraduationCap, 
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
  DollarSign,
  Settings,
  TrendingUp,
  BookOpen,
  Award,
  Database,
  LogOut,
  UserPlus,
  Layers
} from 'lucide-react';

// Import your actual components
import StudentPerformance from "../../Components/StudentPerformance";
import SendSMS from "../../Components/SendSMS";
import { CreateAnnouncement } from "../../Components/CreateAnnouncement";
import { AssignedTeacher } from "../../Components/Parents/AssignedTeacher";
import { AdminFeeDashboard } from '../../Components/admin/AdminFeeDashboard';
import { ResultsViewer } from '../../Components/ResultsViewer';
import { HomeworkList } from '../../Components/HomeworkList';
import { ClassInfo } from '../../Components/ClassInfo';
import StudentsList from '../../Components/Teachers/StudentList';

import Navbar from '../../Components/Navbar';

const AdminDashboard = () => {
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
    { id: 'students', label: 'Student Management', icon: GraduationCap },
    { id: 'teachers', label: 'Teacher Management', icon: Users },
    { id: 'performance', label: 'Academic Performance', icon: TrendingUp },
    { id: 'results', label: 'Results & Grades', icon: BarChart3 },
    { id: 'homework', label: 'Homework Overview', icon: ClipboardList },
    { id: 'attendance', label: 'Attendance Reports', icon: UserCheck },
    { id: 'fees', label: 'Fee Management', icon: DollarSign },
    { id: 'announcements', label: 'School Announcements', icon: Bell },
    { id: 'sms', label: 'SMS Communications', icon: MessageCircle },
    { id: 'reports', label: 'Analytics & Reports', icon: Database },
    { id: 'awards', label: 'Awards & Recognition', icon: Award },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'schedule', label: 'School Calendar', icon: Calendar },
    { id: 'documents', label: 'Document Management', icon: FileText },
    { id: 'settings', label: 'System Settings', icon: Settings },
     { id: 'classes', label: 'Class Management', icon: BookOpen },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="p-6 lg:p-8 space-y-8">
            {/* Welcome Section with Stats at the Top */}
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-indigo-800 mb-4">
                Welcome to <span className="text-emerald-600">Mamashule</span> Admin Portal
              </h1>
              <p className="text-indigo-600 text-lg lg:text-xl">Comprehensive school management and administrative control</p>
            </div>
            
            {/* School Stats Overview - Top Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-indigo-800 mb-6">School Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-200 text-sm">Total Students</p>
                      <p className="text-3xl font-bold">1,247</p>
                    </div>
                    <GraduationCap className="w-8 h-8 text-emerald-300" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm">Teaching Staff</p>
                      <p className="text-3xl font-bold">89</p>
                    </div>
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-200 text-sm">Active Classes</p>
                      <p className="text-3xl font-bold">45</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-emerald-300" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 p-6 rounded-xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm">System Alerts</p>
                      <p className="text-3xl font-bold">7</p>
                    </div>
                    <Bell className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Cards - Admin focused */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-indigo-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={() => setActiveSection('students')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-indigo-800">Student Management</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-indigo-600 text-sm">Oversee all student records and academic progress</p>
                <div className="flex items-center mt-4 text-emerald-600 font-semibold">
                  <span className="text-sm">Manage Students</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
              
              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-emerald-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={() => setActiveSection('teachers')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-indigo-800">Teacher Management</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-indigo-600 text-sm">Manage teaching staff and assignments</p>
                <div className="flex items-center mt-4 text-emerald-600 font-semibold">
                  <span className="text-sm">View Teachers</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>

              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-indigo-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={() => setActiveSection('performance')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-indigo-800">Academic Performance</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-indigo-600 text-sm">Monitor school-wide academic performance</p>
                <div className="flex items-center mt-4 text-emerald-600 font-semibold">
                  <span className="text-sm">View Analytics</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>

              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-emerald-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={() => setActiveSection('fees')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-indigo-800">Financial Management</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-indigo-600 text-sm">Oversee fee payments and financial records</p>
                <div className="flex items-center mt-4 text-emerald-600 font-semibold">
                  <span className="text-sm">Manage Fees</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>

              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-indigo-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={() => setActiveSection('results')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-indigo-800">Results Overview</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-indigo-600 text-sm">Review all student results and grades</p>
                <div className="flex items-center mt-4 text-emerald-600 font-semibold">
                  <span className="text-sm">View Results</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>

              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-emerald-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={() => setActiveSection('announcements')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-indigo-800">School Communications</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <PlusCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-indigo-600 text-sm">Create school-wide announcements</p>
                <div className="flex items-center mt-4 text-emerald-600 font-semibold">
                  <span className="text-sm">Create Announcement</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </div>
            
            {/* Quick Actions Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-indigo-800 mb-6">Quick Administrative Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="bg-gradient-to-r from-indigo-50 to-emerald-50 p-6 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => setActiveSection('sms')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-indigo-800">Broadcast SMS</h3>
                      <p className="text-indigo-600 text-sm">Send messages to students and parents</p>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="bg-gradient-to-r from-emerald-50 to-indigo-50 p-6 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => setActiveSection('reports')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-indigo-800">Generate Reports</h3>
                      <p className="text-indigo-600 text-sm">Create comprehensive school reports</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div 
                  className="bg-gradient-to-r from-indigo-50 to-emerald-50 p-6 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => setActiveSection('documents')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-indigo-800">Document Center</h3>
                      <p className="text-indigo-600 text-sm">Manage school documents and files</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
       case 'students':
        return (
          <div className="p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-indigo-800">Student Management</h1>
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                onClick={() => {/* Add student creation logic */}}
              >
                <UserPlus className="w-5 h-5" />
                Add New Student
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <StudentsList />
            </div>
          </div>
        );

      case 'classes':
        return (
          <div className="p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-indigo-800">Class Management</h1>
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                onClick={() => {/* Add class creation logic */}}
              >
                <Layers className="w-5 h-5" />
                Create New Class
              </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <ClassInfo  />
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">System Settings</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-600">System configuration and settings panel will be displayed here.</p>
            </div>
          </div>
        );
      case 'teachers':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">Teacher Information</h1>
            <AssignedTeacher />
          </div>
        );
      case 'performance':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">Academic Performance Overview</h1>
            <StudentPerformance studentId={"some-student-id"} />
          </div>
        );
      case 'results':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">All Student Results</h1>
            <ResultsViewer />
          </div>
        );
      case 'homework':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">All Homework Assignments</h1>
            <HomeworkList />
          </div>
        );
      case 'attendance':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">School-wide Attendance Reports</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-600">Comprehensive attendance reporting system will be displayed here.</p>
            </div>
          </div>
        );
      case 'fees':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">Fee Management System</h1>
            <AdminFeeDashboard />
          </div>
        );
      case 'announcements':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">School Announcements</h1>
            <CreateAnnouncement />
          </div>
        );
      case 'sms':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">SMS Communications</h1>
            <SendSMS 
              teacherId={localStorage.getItem("userId")} 
              studentId={"admin-broadcast"} 
            />
          </div>
        );
      case 'reports':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">Analytics & Reporting</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-600">Advanced analytics and reporting dashboard will be displayed here.</p>
            </div>
          </div>
        );
      case 'awards':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">Awards & Recognition System</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-600">Student awards and recognition management system will be displayed here.</p>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">Security & Access Control</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-600">System security settings and user access controls will be displayed here.</p>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">School Calendar & Events</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-600">School calendar and event management system will be displayed here.</p>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">Document Management</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-600">School document management and file system will be displayed here.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-indigo-800">Admin Dashboard</h1>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <p className="text-gray-600">Select an option from the sidebar to get started.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
      {/* Fixed Navbar at the top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      {/* Main layout with proper top margin */}
      <div className="pt-20 flex min-h-screen">
        {/* Sidebar - Admin focused gradient */}
        <div className={`fixed top-20 bottom-0 left-0 z-40 w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:top-0 lg:bottom-0 lg:w-72 overflow-y-auto`}>
          <div className="flex items-center justify-between p-4 border-b border-indigo-700 lg:hidden">
            <h2 className="text-lg font-semibold text-white">Admin Tools</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-indigo-700 text-white transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="mt-6 px-6 h-[calc(100vh-7rem)] pb-6 overflow-y-auto">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-4 mb-3 rounded-lg text-left transition-all duration-300 transform hover:scale-105 group ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-indigo-900 shadow-lg font-semibold'
                      : 'text-white hover:bg-indigo-700 hover:text-emerald-200'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className={`w-5 h-5 group-hover:scale-110 transition-transform duration-200 ${
                    activeSection === item.id ? 'text-indigo-800' : ''
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <ChevronRight className="w-4 h-4 ml-auto text-indigo-800" />
                  )}
                </button>
              );
            })}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-4 mt-6 rounded-lg text-left transition-all duration-300 transform hover:scale-105 group bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed top-20 inset-x-0 bottom-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0 lg:pl-6">
          {/* Mobile menu button */}
          <div className="lg:hidden p-6 bg-white shadow-sm">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 rounded-lg hover:bg-indigo-50 text-indigo-700 border border-indigo-200 transition-colors duration-200"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Content area */}
          <div className="min-h-screen px-4 lg:px-6">
            <div className="animate-fadeIn max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        /* Enhanced animations for admin cards */
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .grid > div {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .grid > div:nth-child(1) { animation-delay: 0.1s; }
        .grid > div:nth-child(2) { animation-delay: 0.2s; }
        .grid > div:nth-child(3) { animation-delay: 0.3s; }
        .grid > div:nth-child(4) { animation-delay: 0.4s; }
        .grid > div:nth-child(5) { animation-delay: 0.5s; }
        .grid > div:nth-child(6) { animation-delay: 0.6s; }
        
        /* Additional hover effects for admin interface */
        .group:hover .shadow-lg {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;