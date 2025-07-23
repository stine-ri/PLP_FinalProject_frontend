import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store'; 
import { login } from '../redux/slices/authSlice'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AxiosError } from 'axios';

type AuthResponse = {
  token: string;
  role: 'admin' | 'teacher' | 'parent';
  user: {
     _id: string;
    name: string;
    email: string;
  };
};
const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post<AuthResponse>(
        "http://localhost:5000/api/auth/login", 
        { email, password }
      );

      const { token, role, user } = response.data;

      // Save token and role in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", user._id);
      console.log("Login successful", response.data);
      dispatch(login({ token, role, user }));

      if (role === "admin") navigate("/admin");
      else if (role === "teacher") navigate("/teacher");
      else navigate("/parent");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      console.error("Login error", error);
    } finally {
      setIsLoading(false);
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
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Sign in to your Mamashule account
            </p>
          </div>
          
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
              >
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {/* Email Field */}
            <motion.div 
              variants={fieldVariants} 
              initial="hidden" 
              animate="visible" 
              transition={{ delay: 0.1 }}
            >
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Email Address"
                  required
                  autoComplete="username"
                  className={`w-full border-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                    focusedField === "email" ? "border-purple-400" : "border-gray-200 hover:border-gray-300"
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
            </motion.div>

            {/* Password Field */}
            <motion.div 
              variants={fieldVariants} 
              initial="hidden" 
              animate="visible" 
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  className={`w-full border-2 p-4 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 ${
                    focusedField === "password" ? "border-purple-400" : "border-gray-200 hover:border-gray-300"
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
            </motion.div>

            {/* Forgot Password Link */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="text-right"
            >
              <a 
                href="/forgot-password" 
                className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </a>
            </motion.div>

            {/* Login Button */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="pt-2"
            >
              <motion.button
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`w-full bg-gradient-to-r from-purple-600 to-yellow-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "hover:from-purple-700 hover:to-yellow-600"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">🔐</span>
                    Sign In
                  </div>
                )}
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </motion.div>

            {/* Social Login Buttons */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm hover:border-gray-300 transition-all duration-300"
              >
                <span className="mr-2">🔍</span>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm hover:border-gray-300 transition-all duration-300"
              >
                <span className="mr-2">📘</span>
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <a 
                href="/register" 
                className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign up here
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;