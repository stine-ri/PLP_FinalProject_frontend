import  { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Navbar from '../Components/Navbar';

 const About = () => {
  const ref = useRef(null);
  const teamRef = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const isTeamInView = useInView(teamRef, { once: true });
  const controls = useAnimation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.8,
        delay: custom * 0.2,
        ease: [0.16, 1, 0.3, 1] as const
      }
    })
  };

  const teamMembers = [
    {
      name: "John Doe",
      role: "Founder & CEO",
      bio: "Education technology expert with 15+ years experience in school management systems.",
      img: "👨‍💼"
    },
    {
      name: "Jane Smith",
      role: "CTO",
      bio: "Software architect specializing in secure, scalable education platforms.",
      img: "👩‍💻"
    },
    {
      name: "David Johnson",
      role: "Head of Support",
      bio: "Dedicated to ensuring schools and parents get the most from Mamashule.",
      img: "👨‍🔧"
    },
    {
      name: "Sarah Williams",
      role: "Product Manager",
      bio: "Passionate about creating intuitive educational interfaces.",
      img: "👩‍💼"
    },
    {
      name: "Michael Brown",
      role: "Lead Developer",
      bio: "Expert in building robust school communication systems.",
      img: "👨‍💻"
    }
  ];

  // Infinite scroll animation
  useEffect(() => {
    if (isTeamInView) {
      controls.start({
        x: ['0%', '-50%'],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear"
          }
        }
      });
    }
  }, [isTeamInView, controls]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-yellow-50 text-gray-800">
      <Navbar />
      
      {/* Background elements - fixed z-index */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[40, 20, -20, -40].map((pos, i) => (
          <div 
            key={i}
            className={`absolute ${i % 2 === 0 ? '-left-40' : 'right-20'} ${pos > 0 ? 'top-20' : 'bottom-20'} 
              w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 
              bg-gradient-to-br ${i % 2 === 0 ? 'from-purple-200/20 to-yellow-200/20' : 'from-yellow-200/15 to-purple-200/15'} 
              rounded-full blur-2xl lg:blur-3xl animate-pulse`}
            style={{ animationDelay: `${i * 500}ms` }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative pt-32 pb-20 px-6 min-h-[60vh] flex items-center"
      >
        <div className="max-w-7xl mx-auto w-full text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6"
          >
            <span className="block bg-gradient-to-r from-gray-700 via-purple-600 to-purple-700 bg-clip-text text-transparent">
              About
            </span>
            <span className="block bg-gradient-to-r from-purple-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Mamashule
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto"
          >
            Transforming school-parent communication through innovative technology and transparency.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-20 px-6 relative"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-8 md:p-12 shadow-xl"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <motion.h2 
                  variants={itemVariants}
                  className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent"
                >
                  Our Story
                </motion.h2>
                <motion.p 
                  variants={itemVariants}
                  className="text-lg sm:text-xl text-gray-700 mb-6"
                >
                  <strong className="text-purple-700">Founded in 2025</strong>, Mamashule was created by educators and technologists who saw the need for better school-home communication tools. What started as a small project to help local schools has now grown into a comprehensive platform serving thousands of schools nationwide.
                </motion.p>
                <motion.p 
                  variants={itemVariants}
                  className="text-gray-600"
                >
                  We believe every parent should have instant access to their child's academic progress. Our mission is to bridge the communication gap between schools and parents through real-time, transparent information sharing.
                </motion.p>
              </div>
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-br from-purple-100 to-yellow-100 rounded-2xl p-8 h-full flex items-center justify-center border border-purple-200/50"
              >
                <div className="text-8xl animate-bounce">📚</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        className="py-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
          >
            {[
              { number: "500+", label: "Schools" },
              { number: "10k+", label: "Parents" },
              { number: "98%", label: "Satisfaction" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white/70 backdrop-blur-lg border border-purple-200/50 rounded-2xl p-8 hover:bg-white/90 transition-all duration-500 shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="py-20 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent"
          >
            What Mamashule Offers
          </motion.h2>
          
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: "📊",
                title: "Student Performance Tracking",
                desc: "Parents can view subject-wise quiz results, grades, and overall performance analytics of their child in real-time."
              },
              {
                icon: "📩",
                title: "Instant SMS Alerts",
                desc: "Parents receive notifications via SMS when new quiz results or updates are posted, keeping them always in the loop."
              },
              {
                icon: "👩‍🏫",
                title: "Teacher Dashboard",
                desc: "Teachers can easily enter marks, manage student records, and send bulk messages or individual updates to parents."
              },
              {
                icon: "👪",
                title: "Secure Parent Access",
                desc: "Each parent can only access information related to their own child, ensuring privacy and accountability."
              },
              {
                icon: "📚",
                title: "Student Database",
                desc: "Administrators and teachers can manage student information including name, grade level, and assigned parent."
              },
              {
                icon: "📱",
                title: "Mobile Friendly",
                desc: "Access all features from any device, with a responsive design that works perfectly on smartphones."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/70 backdrop-blur-lg border border-purple-200/50 rounded-2xl p-8 hover:bg-white/90 transition-all duration-500 group shadow-lg hover:shadow-xl"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-yellow-400 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-center text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Team Section with Auto-Scroll */}
      <section ref={teamRef} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent"
          >
            Meet Our Team
          </motion.h2>
          
          <div className="relative overflow-hidden">
            <motion.div
              className="flex"
              animate={controls}
            >
              {[...teamMembers, ...teamMembers].map((member, index) => (
                <motion.div
                  key={`${member.name}-${index}`}
                  className="flex-shrink-0 w-72 mx-4 bg-white/70 backdrop-blur-lg border border-purple-200/50 rounded-2xl p-6 hover:bg-white/90 transition-all duration-500 shadow-lg hover:shadow-xl"
                  custom={index % teamMembers.length}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={slideVariants}
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-yellow-400 rounded-full flex items-center justify-center text-4xl shadow-md">
                    {member.img}
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">{member.name}</h3>
                  <p className="text-yellow-600 text-center mb-4 font-medium">{member.role}</p>
                  <p className="text-gray-600 text-center">{member.bio}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-100 to-yellow-100 border border-purple-200/50 rounded-3xl p-8 md:p-12 shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">Ready to transform your school communication?</h2>
            <p className="text-xl text-gray-600 mb-8">Join thousands of schools already using Mamashule.</p>
            <a
              href="/register"
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 font-bold px-8 py-4 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;