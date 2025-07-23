import  { useState } from 'react';
import { 
  User, 
  BookOpen, 
  Users, 
  BarChart3, 
  ClipboardList, 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  Bell,
  Menu,
  X,
  Home,
  ChevronRight
} from 'lucide-react';

// Import your actual components
import { ParentChildProfile } from '../../Components/Parents/ChildProfile';
import { ParentDashboard as ParentClassInfo } from '../../Components/Parents/ClassInfo';
import { AssignedTeacher } from '../../Components/Parents/AssignedTeacher';
import { ResultsViewer } from '../../Components/ResultsViewer';
import { AttendanceHistory } from '../../Components/Parents/AttendanceHistory';
import { FeePayment } from '../../Components/Parents/FeePayments';
import ChatWithTeachers from '../../Components/Parents/ChatWithTeachers';
import { Announcements } from '../../Components/Parents/Announcements';
import { HomeworkList } from '../../Components/HomeworkList';
import Navbar from '../../Components/Navbar';

const ParentDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'profile', label: 'Child Profile', icon: User },
    { id: 'class', label: 'Class Info', icon: BookOpen },
    { id: 'teacher', label: 'Teacher', icon: Users },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'homework', label: 'Homework', icon: ClipboardList },
    { id: 'attendance', label: 'Attendance', icon: Calendar },
    { id: 'fees', label: 'Fee Payment', icon: CreditCard },
    { id: 'chat', label: 'Messages', icon: MessageCircle },
    { id: 'announcements', label: 'Announcements', icon: Bell }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Child Profile</h1>
            <ParentChildProfile />
          </div>
        );
      case 'class':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Class Information</h1>
            <ParentClassInfo />
          </div>
        );
      case 'teacher':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Assigned Teacher</h1>
            <AssignedTeacher />
          </div>
        );
      case 'results':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">My Child's Results</h1>
            <ResultsViewer />
          </div>
        );
      case 'homework':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">My Child's Homework</h1>
            <HomeworkList />
          </div>
        );
      case 'attendance':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Attendance History</h1>
            <AttendanceHistory />
          </div>
        );
      case 'fees':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Fee Payments</h1>
            <FeePayment />
          </div>
        );
      case 'chat':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Chat with Teachers</h1>
            <ChatWithTeachers />
          </div>
        );
      case 'announcements':
        return (
          <div className="p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6 text-purple-800">Announcements</h1>
            <Announcements />
          </div>
        );
      default:
        return (
          <div className="p-6 lg:p-8 space-y-8">
            <div className="text-center mb-8 lg:mb-12">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-purple-800 mb-4">
                Welcome to <span className="text-yellow-600">Mamashule</span> Parent Portal
              </h1>
              <p className="text-purple-600 text-lg lg:text-xl">Monitor your child's academic progress and school activities</p>
            </div>
            
            {/* Quick Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setActiveSection('profile')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-purple-800">Child Profile</h3>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-purple-600 text-sm">View your child's profile information and academic details</p>
                <div className="flex items-center mt-3 text-yellow-600 font-semibold">
                  <span className="text-sm">View Profile</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setActiveSection('results')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-purple-800">Latest Results</h3>
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-purple-600 text-sm">Check your child's exam results and academic performance</p>
                <div className="flex items-center mt-3 text-yellow-600 font-semibold">
                  <span className="text-sm">View Results</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setActiveSection('homework')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-purple-800">Homework Tasks</h3>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-purple-600 text-sm">Track assignments and homework completion status</p>
                <div className="flex items-center mt-3 text-yellow-600 font-semibold">
                  <span className="text-sm">View Tasks</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setActiveSection('attendance')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-purple-800">Attendance</h3>
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-purple-600 text-sm">Monitor your child's attendance record and patterns</p>
                <div className="flex items-center mt-3 text-yellow-600 font-semibold">
                  <span className="text-sm">View Attendance</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setActiveSection('fees')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-purple-800">Fee Payments</h3>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-purple-600 text-sm">Manage school fees and payment history</p>
                <div className="flex items-center mt-3 text-yellow-600 font-semibold">
                  <span className="text-sm">View Payments</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              <div 
                className="bg-white p-6 lg:p-8 rounded-xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => setActiveSection('chat')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-purple-800">Teacher Messages</h3>
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-purple-600 text-sm">Communicate directly with your child's teachers</p>
                <div className="flex items-center mt-3 text-yellow-600 font-semibold">
                  <span className="text-sm">Open Chat</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar at the top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      {/* Main layout with proper top margin */}
      <div className="pt-20 flex min-h-screen">
        {/* Sidebar - adjusted to start below navbar */}
        <div className={`fixed top-20 bottom-0 left-0 z-40 w-64 bg-gradient-to-b from-purple-700 to-purple-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:top-0 lg:bottom-0 lg:w-72`}>
          <div className="flex items-center justify-between p-4 border-b border-purple-600 lg:hidden">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-purple-600 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="mt-6 px-6 h-full overflow-y-auto pb-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-4 mb-3 rounded-lg text-left transition-all duration-200 transform hover:scale-105 ${
                    activeSection === item.id
                      ? 'bg-yellow-500 text-purple-800 shadow-lg font-semibold'
                      : 'text-white hover:bg-purple-600 hover:text-yellow-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
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
              className="p-3 rounded-lg hover:bg-gray-100 text-purple-700 border border-gray-200"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Content area */}
          <div className="min-h-screen bg-gray-50 px-4 lg:px-6">
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
      `}</style>
    </div>
  );
};

export default ParentDashboard;