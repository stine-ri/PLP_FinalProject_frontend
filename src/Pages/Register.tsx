import React, { useState, useEffect } from "react";
import { motion, AnimatePresence} from "framer-motion";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AxiosError } from 'axios';
import { 
  registerStart,
  registerSuccess,
  registerFailure 
} from '../redux/slices/authSlice';

type FormData = {
  name: string;
  email: string;
  password: string;
  role: "parent" | "teacher" | "admin";
  phone?: string;
  studentId?: string;
};
interface Student {
  _id: string;
  name: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
 const [students, setStudents] = useState<Student[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role: "parent",
    phone: "",
    studentId: ""
  });
useEffect(() => {
  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students/public/list');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setStudents(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error('Error fetching public student list:', err);
      setStudents([]);
    }
  };

  if (formData.role === 'parent') {
    fetchStudents();
  }
}, [formData.role]);

  const [errors, setErrors] = useState<Partial<FormData> & { server?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
   const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Additional validation for parents
    if (formData.role === "parent") {
      if (!formData.phone?.trim()) newErrors.phone = "Phone number is required";
      if (!formData.studentId?.trim()) newErrors.studentId = "Student ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  dispatch(registerStart());
  setIsSubmitting(true);
  setErrors({});

  try {
    const dataToSend = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      ...(formData.role === "parent" && {
        phone: formData.phone,
        studentId: formData.studentId
      })
    };

    const response = await axios.post(`http://localhost:5000/api/auth/register`, dataToSend);
    
    // Dispatch success with the error message parameter
    dispatch(registerSuccess({
      token: response.data.token,
      role: response.data.role,
      user: response.data.user
    }));

    // Save to localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // Redirect based on role
    navigate(response.data.role === 'admin' ? '/admin' : 
            response.data.role === 'teacher' ? '/teacher' : '/parent');

  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Registration error details:", {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      headers: axiosError.response?.headers,
      config: axiosError.config
    });

    // Create error message
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.message || "Registration failed. Please try again."
      : "An unexpected error occurred";
    
    // Dispatch failure with the error message
    dispatch(registerFailure(errorMessage));
    
    setErrors({ server: errorMessage });
  } finally {
    setIsSubmitting(false);
  }
};

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-yellow-50 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-200/20 to-yellow-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-yellow-200/15 to-purple-200/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-100/15 to-yellow-100/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <span className="text-3xl text-white">🎓</span>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent mb-2">
              Join Mamashule
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Create your account to get started
            </p>
          </div>
          
          {/* Server Error */}
          <AnimatePresence>
            {errors.server && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
              >
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  {errors.server}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {/* Name Field */}
            <motion.div variants={fieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Full Name"
                  required
                  className={`w-full border-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                    errors.name ? "border-red-400 focus:border-red-400" : focusedField === "name" ? "border-purple-400" : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <span className="text-gray-400">👤</span>
                </div>
                {focusedField === "name" && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full"
                  />
                )}
              </div>
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-2 ml-1"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={fieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Email Address"
                  required
                  className={`w-full border-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                    errors.email ? "border-red-400 focus:border-red-400" : focusedField === "email" ? "border-purple-400" : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <span className="text-gray-400">✉️</span>
                </div>
                {focusedField === "email" && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full"
                  />
                )}
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-2 ml-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={fieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Password"
                  required
                  className={`w-full border-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                    errors.password ? "border-red-400 focus:border-red-400" : focusedField === "password" ? "border-purple-400" : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span>{showPassword ? "🙈" : "👁️"}</span>
                </button>
                {focusedField === "password" && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full"
                  />
                )}
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs mt-2 ml-1"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Role Selection */}
            <motion.div variants={fieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("role")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full border-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                    focusedField === "role" ? "border-purple-400" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="parent">👨‍👩‍👧‍👦 Parent</option>
                  <option value="teacher">👨‍🏫 Teacher</option>
                  <option value="admin">👑 Admin</option>
                </select>
                {focusedField === "role" && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full"
                  />
                )}
              </div>
            </motion.div>

            {/* Conditional Parent Fields */}
            <AnimatePresence>
              {formData.role === "parent" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  {/* Phone Field */}
                  <motion.div variants={fieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}>
                    <div className="relative">
                      <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full border-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                          errors.phone ? "border-red-400 focus:border-red-400" : focusedField === "phone" ? "border-purple-400" : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <span className="text-gray-400">📱</span>
                      </div>
                      {focusedField === "phone" && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full"
                        />
                      )}
                    </div>
                    <AnimatePresence>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-red-500 text-xs mt-2 ml-1"
                        >
                          {errors.phone}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Student ID Field */}
                  <motion.div variants={fieldVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
  <div className="relative">
    <select
      name="studentId"
      value={formData.studentId}
      onChange={handleChange}
      onFocus={() => setFocusedField("studentId")}
      onBlur={() => setFocusedField(null)}
      className={`w-full border-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 appearance-none ${
        errors.studentId
          ? "border-red-400 focus:border-red-400"
          : focusedField === "studentId"
          ? "border-purple-400"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <option value="">Select Student</option>
      {students.map((student) => (
        <option key={student._id} value={student._id}>
          {student.name}
        </option>
      ))}
    </select>

    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
      <span className="text-gray-400">🎓</span>
    </div>

    {focusedField === "studentId" && (
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full"
      />
    )}
  </div>

  <AnimatePresence>
    {errors.studentId && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-red-500 text-xs mt-2 ml-1"
      >
        {errors.studentId}
      </motion.p>
    )}
  </AnimatePresence>
</motion.div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.7 }}
              className="pt-2"
            >
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full bg-gradient-to-r from-purple-600 to-yellow-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:from-purple-700 hover:to-yellow-600"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    Create Account
                  </div>
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign in here
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;