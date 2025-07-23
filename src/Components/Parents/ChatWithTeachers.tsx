import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { AxiosError } from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mama-shule.onrender.com/';

interface User {
  _id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Message {
  _id: string;
  sender: User;
  receiver: User;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  attachments: {
    url: string;
    name: string;
    type: string;
  }[];
  createdAt: string;
  readAt?: string;
}

interface Conversation {
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

const ChatWithTeachers: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableTeachers, setAvailableTeachers] = useState<User[]>([]);
  const [newChatRecipient, setNewChatRecipient] = useState<string>('');
  const [initialMessage, setInitialMessage] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 3,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: acceptedFiles => {
      setAttachments(prev => [...prev, ...acceptedFiles]);
    }
  });

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io(import.meta.env.VITE_SOCKET_SERVER_URL || '', {
      auth: { token },
      transports: ['websocket']
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch conversations, teachers and students
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch conversations
        const convResponse = await axios.get(`${API_BASE_URL}/api/chat/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(convResponse.data || []);

        // Fetch teachers
        const teachersResponse = await axios.get(`${API_BASE_URL}/api/users/teachers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAvailableTeachers(teachersResponse.data);

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${API_BASE_URL}/api/chat/${selectedConversation._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load messages');
        }
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Socket.io message listener
  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
      
      // Update conversations with new message
      setConversations(prev => {
        const otherUserId = message.sender._id === selectedConversation?._id 
          ? message.receiver._id 
          : message.sender._id;
        
        return prev.map(conv => 
          conv.user._id === otherUserId
            ? { ...conv, lastMessage: message, unreadCount: 0 }
            : conv
        );
      });

      scrollToBottom();
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, selectedConversation]);

  // Join user's room when socket is ready
  useEffect(() => {
    if (!socket) return;

    const userId = localStorage.getItem('userId');
    if (userId) {
      socket.emit('join', userId);
    }
  }, [socket]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConversation || !socket) return;

    try {
      const token = localStorage.getItem('token');
      
      // Upload attachments if any
      let uploadedAttachments = [];
      if (attachments.length > 0) {
        const formData = new FormData();
        attachments.forEach(file => formData.append('files', file));

        const uploadResponse = await axios.post(`${API_BASE_URL}/api/uploads`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        uploadedAttachments = uploadResponse.data;
      }

      // Send the message (no studentId needed)
      const messageData = {
        content: newMessage,
        receiverId: selectedConversation._id,
        attachments: uploadedAttachments
      };

      await axios.post(`${API_BASE_URL}/api/chat`, messageData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNewMessage('');
      setAttachments([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartNewChat = async () => {
    if (!newChatRecipient || !initialMessage.trim()) {
      setError('Please select a teacher and enter a message');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_BASE_URL}/api/chat/start`,
        {
          recipientId: newChatRecipient,
          content: initialMessage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      if (response.data.success) {
        const teacher = availableTeachers.find(t => t._id === newChatRecipient);
        if (teacher) {
          setConversations(prev => [
            ...prev,
            {
              user: teacher,
              lastMessage: response.data.data,
              unreadCount: 0
            }
          ]);
          setSelectedConversation(teacher);
        }

        setShowNewChatModal(false);
        setNewChatRecipient('');
        setInitialMessage('');
      }
    } catch (error) {
      const err = error as AxiosError<{
        error?: string;
        message?: string;
        code?: string;
        suggestion?: string;
      }>;

      if (err.response) {
        // Handle 503 - No teachers available
        if (err.response.status === 503 && err.response.data?.code === 'NO_TEACHERS') {
          setError(`${err.response.data.error}. ${err.response.data.suggestion}`);
        } 
        // Handle other error cases
        else if (err.response.status === 404) {
          setError(`Endpoint not found. Please check: ${API_BASE_URL}/api/chat/start`);
        } else if (err.response.data?.error === 'Teacher not found') {
          setError('The selected teacher was not found. Please try again.');
          fetchAvailableTeachers(); // Refresh teacher list
        } else {
          setError(
            err.response.data?.message ||
            'Failed to start conversation. Please try again.'
          );
        }
      } else if (err.request) {
        setError('No response from server. Check your network.');
      } else {
        setError('Failed to setup request: ' + err.message);
      }
    }
  };

  const fetchAvailableTeachers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/teachers`);
      const data: User[] = await res.json();

      const teachers = data.filter((user: User) => user.role === 'teacher');
      setAvailableTeachers(teachers);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-12 w-12 rounded-full border-t-2 border-b-2 border-purple-500"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-red-100 text-red-700 rounded-lg shadow-sm"
      >
        <p>{error}</p>
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
    <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-150px)] max-h-screen">
      <div className="flex h-full flex-col md:flex-row">
        {/* Conversations sidebar */}
        <div className={`w-full md:w-1/3 border-r border-purple-100 overflow-y-auto bg-white transition-all duration-300 ${
          selectedConversation ? 'hidden md:block' : 'block'
        }`}>
          <div className="p-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-yellow-50 sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-purple-800">Messages</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewChatModal(true)}
                className="px-3 py-1 bg-gradient-to-r from-purple-500 to-yellow-500 text-white rounded-lg text-sm shadow-md hover:from-purple-600 hover:to-yellow-600 transition-all"
              >
                New Chat
              </motion.button>
            </div>
          </div>
          
          <div className="divide-y divide-purple-50">
            {conversations.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 text-center"
              >
                <div className="text-purple-300 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500">No conversations yet</p>
                <button 
                  onClick={() => setShowNewChatModal(true)}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-yellow-500 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-yellow-600 transition-all"
                >
                  Start a new conversation
                </button>
              </motion.div>
            ) : (
              conversations.map(conversation => (
                <motion.div
                  key={conversation.user._id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedConversation?._id === conversation.user._id
                      ? 'bg-purple-50'
                      : 'hover:bg-purple-50'
                  }`}
                  onClick={() => setSelectedConversation(conversation.user)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-purple-900">{conversation.user.name}</h3>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400">
                        {new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {conversation.unreadCount > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-1 px-2 py-0.5 bg-red-500 text-white rounded-full text-xs"
                        >
                          {conversation.unreadCount}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 flex flex-col bg-white ${
          selectedConversation ? 'block' : 'hidden md:flex'
        }`}>
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-yellow-50 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden mr-2 p-1 rounded-full hover:bg-purple-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <h3 className="font-bold text-purple-800">
                    {selectedConversation.name} ({selectedConversation.role})
                  </h3>
                </div>
                <button 
                  onClick={() => setShowNewChatModal(true)}
                  className="md:hidden px-3 py-1 bg-gradient-to-r from-purple-500 to-yellow-500 text-white rounded-lg text-sm shadow-md hover:from-purple-600 hover:to-yellow-600 transition-all"
                >
                  New Chat
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-purple-50">
                {messages.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-purple-300 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </motion.div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${
                        message.sender._id === localStorage.getItem('userId')
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg p-3 shadow-sm ${
                          message.sender._id === localStorage.getItem('userId')
                            ? 'bg-gradient-to-r from-purple-500 to-yellow-500 text-white'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        {message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((file, index) => (
                              <a
                                key={index}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`block p-2 rounded text-sm truncate ${
                                  message.sender._id === localStorage.getItem('userId')
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white text-purple-700'
                                }`}
                              >
                                {file.type.startsWith('image') ? '🖼️ ' : '📄 '}
                                {file.name}
                              </a>
                            ))}
                          </div>
                        )}
                        <div className={`text-xs mt-1 ${
                          message.sender._id === localStorage.getItem('userId')
                            ? 'text-purple-100'
                            : 'text-purple-500'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-purple-100 bg-white sticky bottom-0">
                {/* Attachments preview */}
                {attachments.length > 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="flex flex-wrap gap-2 mb-2"
                  >
                    {attachments.map((file, index) => (
                      <motion.div 
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="relative"
                      >
                        <div className="bg-purple-50 p-2 rounded-lg text-xs flex items-center border border-purple-100">
                          <span className="mr-1">
                            {file.type.startsWith('image') ? '🖼️' : '📄'}
                          </span>
                          <span className="truncate max-w-xs">{file.name}</span>
                          <button
                            onClick={() => removeAttachment(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <div className="flex space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 border border-purple-200 rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <span className="text-purple-500">📎</span>
                    </div>
                  </motion.div>

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 border border-purple-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                  <motion.button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && attachments.length === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg text-white shadow-md ${
                      (!newMessage.trim() && attachments.length === 0) 
                        ? 'bg-gray-400' 
                        : 'bg-gradient-to-r from-purple-500 to-yellow-500 hover:from-purple-600 hover:to-yellow-600'
                    }`}
                  >
                    Send
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-purple-50"
            >
              <div className="text-center p-6 max-w-md">
                <div className="text-purple-300 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-purple-800 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500 mb-4">
                  Choose a teacher to start chatting about your child's progress
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewChatModal(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-yellow-500 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-yellow-600 transition-all"
                >
                  Start New Chat
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewChatModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-purple-800 mb-4">Start New Chat</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Teacher</label>
                  <select
                    value={newChatRecipient}
                    onChange={(e) => setNewChatRecipient(e.target.value)}
                    className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    required
                  >
                    <option value="">Select a teacher</option>
                    {availableTeachers.map(teacher => (
                      <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Initial Message</label>
                  <textarea
                    value={initialMessage}
                    onChange={(e) => setInitialMessage(e.target.value)}
                    className="w-full rounded-lg border border-purple-200 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    rows={3}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewChatModal(false)}
                  className="px-4 py-2 border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartNewChat}
                  disabled={!newChatRecipient || !initialMessage.trim()}
                  className={`px-4 py-2 rounded-lg text-white ${
                    (!newChatRecipient || !initialMessage.trim())
                      ? 'bg-gray-400'
                      : 'bg-gradient-to-r from-purple-500 to-yellow-500 hover:from-purple-600 hover:to-yellow-600'
                  }`}
                >
                  Start Chat
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWithTeachers;