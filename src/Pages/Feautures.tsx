import React, { useEffect } from "react";
import { motion, useAnimation  } from "framer-motion";
import type { Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Navbar from "../Components/Navbar";

const Features = () => {
  const features = [
    {
      icon: "📊",
      title: "Real-Time Student Performance",
      description: "Parents can view their child's academic progress and performance reports as soon as teachers upload them.",
      gradient: "from-purple-500 to-indigo-600"
    },
    {
      icon: "📩",
      title: "Instant Messaging",
      description: "Teachers and school admins can send SMS updates directly to parents about important events and notices.",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: "👨‍🏫",
      title: "Role-Based Dashboards",
      description: "Tailored experiences for parents, teachers, and admins ensure everyone gets the features they need.",
      gradient: "from-teal-400 to-cyan-500"
    },
    {
      icon: "📅",
      title: "School Event Updates",
      description: "Stay on top of school calendar updates, meetings, and co-curricular activities — all in one place.",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: "🔒",
      title: "Secure Access",
      description: "Each user account is protected and tied to specific permissions for authorized access only.",
      gradient: "from-emerald-400 to-teal-500"
    },
    {
      icon: "📱",
      title: "Mobile-Friendly Design",
      description: "Fully responsive design makes it easy to access features from any device, anytime.",
      gradient: "from-yellow-400 to-amber-500"
    },
    {
      icon: "🤖",
      title: "AI-Powered Chatbot",
      description: "Get instant answers to common questions about school policies, schedules, and procedures with our intelligent chatbot assistant.",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: "📝",
      title: "Interactive Quizzes & Assessments",
      description: "Comprehensive quiz system for CBC curriculum and Form 2-4 students with instant feedback and progress tracking.",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: "🌙",
      title: "24/7 Platform Availability",
      description: "Access all features round-the-clock. Check grades, send messages, and stay connected with your school community anytime.",
      gradient: "from-indigo-500 to-blue-600"
    }
  ];

  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { y: 60, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" ,
        type: "spring" ,
        stiffness: 100,
        damping: 15
      }
    }
  } satisfies Variants;

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden">
      <Navbar />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-purple-200/30 to-yellow-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-yellow-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-100/20 to-yellow-100/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <section className="px-4 sm:px-6 py-20 md:py-24 lg:py-28 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={titleVariants}
            initial="hidden"
            animate={controls}
            className="text-center mb-16 md:mb-20 lg:mb-24"
            ref={ref}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-yellow-100 rounded-full mb-6">
              <span className="text-purple-700 font-semibold text-sm">✨ Platform Features</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                Why Choose
              </span>
              <span className="block bg-gradient-to-r from-yellow-500 via-yellow-600 to-amber-600 bg-clip-text text-transparent">
                Mamashule?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Bridging the communication gap through{" "}
              <span className="bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent font-semibold">
                innovative school technology
              </span>
              .
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                whileHover={{ 
                  y: -15,
                  scale: 1.03,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group relative"
              >
                {/* Card backdrop with glassmorphism effect */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 group-hover:shadow-2xl transition-all duration-500"></div>
                
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-300/50 to-yellow-300/50 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content container */}
                <div className="relative p-8 lg:p-10 h-full flex flex-col">
                  {/* Icon with gradient background */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <span className="text-white drop-shadow-sm">{feature.icon}</span>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Hover arrow indicator */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center text-purple-600 font-semibold">
                      <span className="mr-2">Learn more</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to action section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-20 text-center"
          >
            <div className="bg-gradient-to-r from-purple-600 to-yellow-500 rounded-3xl p-8 md:p-12 shadow-2xl">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to transform your school?
              </h3>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join thousands of schools already using Mamashule to improve communication and engagement.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 text-lg shadow-lg"
              >
                Get Started Today
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;