import React, { useState, useEffect, useRef } from "react";
import Navbar from '../Components/Navbar';


// Helper function for social icons

type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin';

const getSocialIconPath = (platform: SocialPlatform): string => {
  const paths = {
    facebook: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
    twitter: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    linkedin: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
  };
  return paths[platform] || "";
};

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    // Trigger entrance animations
    const loadTimer = setTimeout(() => setIsLoaded(true), 300);

    // Mouse tracking for interactive effects
    const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    // Observe all sections
    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(loadTimer);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: "📊",
      title: "Student Performance Tracking",
      desc: "Parents can view subject-wise quiz results, grades, and overall performance analytics of their child in real-time.",
      gradient: "from-purple-400 via-pink-400 to-red-400"
    },
    {
      icon: "📩",
      title: "Instant SMS Alerts",
      desc: "Parents receive notifications via SMS when new quiz results or updates are posted, keeping them always in the loop.",
      gradient: "from-blue-400 via-purple-400 to-pink-400"
    },
    {
      icon: "👩‍🏫",
      title: "Teacher Dashboard",
      desc: "Teachers can easily enter marks, manage student records, and send bulk messages or individual updates to parents.",
      gradient: "from-indigo-400 via-purple-400 to-pink-400"
    },
    {
      icon: "👪",
      title: "Secure Parent Access",
      desc: "Each parent can only access information related to their own child, ensuring privacy and accountability.",
      gradient: "from-pink-400 via-purple-400 to-indigo-400"
    },
    {
      icon: "📚",
      title: "Student Database",
      desc: "Administrators and teachers can manage student information including name, grade level, and assigned parent.",
      gradient: "from-cyan-400 via-blue-400 to-purple-400"
    }
  ];

  // Add section refs dynamically
const addToRefs = (el: HTMLElement | null) => {
  if (el && !sectionsRef.current.includes(el)) {
    sectionsRef.current.push(el);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 text-white overflow-x-hidden relative">
        <Navbar />
      {/* Interactive cursor glow - optimized for performance */}
      <div 
        className="fixed pointer-events-none z-50 w-64 h-64 md:w-96 md:h-96 opacity-20 md:opacity-30 blur-3xl transition-transform duration-300 will-change-transform"
        style={{
          transform: `translate(${mousePosition.x - 128}px, ${mousePosition.y - 128}px)`,
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(219, 39, 119, 0.2) 50%, transparent 100%)'
        }}
      />

      {/* Optimized animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[40, 20, -20, -40].map((pos, i) => (
          <div 
            key={i}
            className={`absolute ${i % 2 === 0 ? '-left-40' : 'right-20'} ${pos > 0 ? 'top-20' : 'bottom-20'} 
              w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 
              bg-gradient-to-br ${i % 2 === 0 ? 'from-purple-500/30 to-pink-500/30' : 'from-blue-500/20 to-purple-500/20'} 
              rounded-full blur-2xl lg:blur-3xl animate-pulse`}
            style={{ animationDelay: `${i * 500}ms` }}
          />
        ))}
      </div>

      {/* Optimized floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white/20 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section - Improved responsive layout */}
      <section 
        id="hero"
        ref={addToRefs}
        data-animate 
        className="relative pt-24 pb-16 md:pt-32 md:pb-20 px-4 sm:px-6 min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 md:space-y-8">
              {/* Title Animation */}
              <div className={`transition-all duration-1000 ease-out ${
                isLoaded 
                  ? 'opacity-100 translate-x-0 scale-100' 
                  : 'opacity-0 -translate-x-10 scale-95'
              }`}>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight md:leading-none mb-4 md:mb-6">
                  <span className="block bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent">
                    Welcome to
                  </span>
                  <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent animate-pulse">
                    Mamashule
                  </span>
                </h1>
              </div>
              
              {/* Description Animation */}
              <div className={`transition-all duration-1000 ease-out delay-200 ${
                isLoaded 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-8'
              }`}>
                <p className="text-xl sm:text-2xl text-purple-100 leading-relaxed font-light">
                  An innovative school monitoring platform designed to enhance 
                  <span className="text-purple-200 font-medium"> communication and transparency </span>
                  between parents, teachers, and students.
                </p>
              </div>

              {/* Buttons Animation - Improved mobile layout */}
              <div className={`transition-all duration-1000 ease-out delay-300 ${
                isLoaded 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-6'
              }`}>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <a
                    href="/register"
                    className="group relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg sm:text-xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center">
                      Get Started
                      <span className="ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform duration-300">🚀</span>
                    </span>
                  </a>
                  <button className="border-2 border-purple-300 px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg sm:text-xl text-purple-200 hover:bg-purple-400/20 hover:border-purple-200 hover:text-white transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Stats Animation - Responsive layout */}
              <div className={`transition-all duration-1000 ease-out delay-500 ${
                isLoaded 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-4'
              }`}>
                <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 pt-6 md:pt-8">
                  {[
                    { number: "500+", label: "Schools" },
                    { number: "10k+", label: "Parents" },
                    { number: "98%", label: "Satisfaction" }
                  ].map((stat, index) => (
                    <div key={index} className="text-center px-2 sm:px-0">
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-purple-300 text-sm sm:text-base">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Illustration - Better responsive behavior */}
            <div className={`relative transition-all duration-1000 ease-out delay-400 ${
              isLoaded 
                ? 'opacity-100 translate-x-0 scale-100' 
                : 'opacity-0 translate-x-10 scale-95'
            }`}>
              <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-purple-500/30 to-pink-500/40 rounded-2xl md:rounded-3xl backdrop-blur-xl border border-purple-400/30 shadow-xl md:shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-pink-400/10 rounded-2xl md:rounded-3xl"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 sm:p-8">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl md:rounded-3xl mb-6 md:mb-8 flex items-center justify-center text-4xl sm:text-5xl shadow-lg md:shadow-xl animate-bounce">
                      🎓
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-center bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                      School Monitoring
                    </h3>
                    <p className="text-purple-200 text-center text-base sm:text-lg">
                      Real-time tracking and communication platform for modern education
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Improved grid layout */}
      <section 
        id="features" 
        ref={addToRefs}
        data-animate 
        className="py-16 md:py-20 px-4 sm:px-6 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 md:mb-20 transition-all duration-1000 ${
            visibleSections.has('features')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 md:mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent">
              🔍 What Mamashule Offers
            </h2>
            <div className="w-24 h-1.5 sm:w-32 sm:h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 mx-auto rounded-full shadow-lg"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={addToRefs}
                className={`group relative bg-white/10 backdrop-blur-lg sm:backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:bg-white/20 transition-all duration-500 transform hover:scale-[1.03] hover:-translate-y-1 ${
                  visibleSections.has('features')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-purple-600/20 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-r ${feature.gradient} rounded-xl md:rounded-2xl mb-4 md:mb-6 flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-400`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-purple-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-purple-200 leading-relaxed text-base sm:text-lg group-hover:text-purple-100 transition-colors duration-300">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section - Better responsive padding */}
      <section 
        id="why" 
        ref={addToRefs}
        data-animate 
        className="py-16 md:py-20 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ${
            visibleSections.has('why')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 md:mb-6 bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent">
                🚀 Why Choose Mamashule?
              </h2>
            </div>
            
            <div className="relative bg-white/10 backdrop-blur-lg sm:backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden group hover:bg-white/20 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl md:rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <p className="text-lg sm:text-xl md:text-2xl text-purple-100 leading-relaxed text-center font-light">
                  In many schools, parents often remain unaware of their child's progress until end-of-term reports or disciplinary issues arise.
                  <span className="text-white font-medium"> Mamashule addresses this gap </span>
                  by providing a centralized digital platform for instant and transparent school communication.
                  It's easy to use, mobile-friendly, and built to support education in a modern, connected world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Better button sizing */}
      <section 
        id="contact" 
        ref={addToRefs}
        data-animate 
        className="py-16 md:py-20 px-4 sm:px-6"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${
            visibleSections.has('contact')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 md:mb-8 bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-purple-100 mb-8 md:mb-12 font-light">
              Join thousands of schools already using Mamashule to improve parent-teacher communication.
            </p>
            <a
              href="/register"
              className="inline-block bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 px-8 py-4 sm:px-12 sm:py-5 md:px-16 md:py-6 rounded-xl md:rounded-2xl font-bold text-lg sm:text-xl md:text-2xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 group"
            >
              <span className="flex items-center justify-center">
                Get Started Today
                <span className="ml-3 sm:ml-4 group-hover:translate-x-2 transition-transform duration-300">✨</span>
              </span>
            </a>
          </div>
        </div>
      </section>
{/* Footer - Updated with consistent text sizes */}
<footer className="relative bg-gradient-to-b from-purple-900/50 via-purple-800/30 to-transparent pt-16 pb-8 px-4 sm:px-6 border-t border-purple-400/20 overflow-hidden">
  {/* Decorative elements */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-40 -right-20 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl"></div>
  </div>

  <div className="max-w-7xl mx-auto relative z-10">
    {/* Main footer content */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
      {/* Company info */}
      <div className="text-center md:text-left">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent mb-4">
          Mamashule
        </h3>
        <p className="text-purple-200 text-base leading-relaxed">
          Empowering schools with transparent communication and real-time student performance tracking.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
        <ul className="space-y-3">
          {['Home', 'About', 'Features', 'Contact'].map((item) => (
            <li key={item}>
              <a 
                href={`#${item.toLowerCase()}`} 
                className="text-purple-300 hover:text-yellow-300 text-base transition-colors duration-300"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
        <ul className="space-y-3 text-purple-300 text-base">
          <li className="flex items-center justify-center md:justify-start space-x-3">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>info@mamashule.com</span>
          </li>
          <li className="flex items-center justify-center md:justify-start space-x-3">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+1 (555) 123-4567</span>
          </li>
          <li className="flex items-center justify-center md:justify-start space-x-3">
            <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>123 School St, Education City</span>
          </li>
        </ul>
      </div>

      {/* Newsletter */}
      <div>
        <h4 className="text-white font-semibold text-lg mb-4">Stay Updated</h4>
        <form className="flex flex-col space-y-3">
          <input 
            type="email" 
            placeholder="Your email" 
            className="bg-purple-900/50 border border-purple-400/30 rounded-lg px-4 py-2 text-white text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-purple-300"
          />
          <button 
            type="submit"
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 font-medium py-2 px-4 rounded-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 text-base shadow-lg hover:shadow-yellow-400/20"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>

    {/* Social Links */}
    <div className="flex justify-center space-x-6 mb-8">
      {(['facebook', 'twitter', 'instagram', 'linkedin'] as const).map((social) => (
        <a 
          key={social} 
          href="#" 
          className="text-purple-300 hover:text-yellow-300 transition-colors duration-300"
          aria-label={`Follow us on ${social}`}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d={getSocialIconPath(social)} />
          </svg>
        </a>
      ))}
    </div>

    {/* Copyright */}
    <div className="pt-6 border-t border-purple-400/20">
      <div className="text-purple-300 text-base flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Mamashule. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-yellow-300 transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="hover:text-yellow-300 transition-colors duration-300">Terms of Service</a>
        </div>
      </div>
    </div>
  </div>
</footer>


    </div>
  );
};

export default Home;