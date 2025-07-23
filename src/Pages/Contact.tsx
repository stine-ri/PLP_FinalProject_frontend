import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from '../Components/Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    userType: 'parent'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const formRef = useRef(null);
  const infoRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });
  const isInfoInView = useInView(infoRef, { once: true, amount: 0.3 });

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
      transition: { duration: 0.6, ease: "easeOut" as const}
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | 
    HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        userType: 'parent'
      });
    } catch (error) {
      console.error('Submission error:', error); 
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Us",
      info: "christinenyambwari.com",
      description: "Get in touch for any questions or support"
    },
    {
      icon: "📞",
      title: "Call Us",
      info: "+254 705 912 632", 
      description: "Monday - Friday, 8:00 AM - 6:00 PM"
    },
    {
      icon: "📍",
      title: "Visit Us",
      info: "Nakuru, Kenya",
      description: "Naivasha"
    },
    {
      icon: "💬",
      title: "Live Chat",
      info: "Available 24/7",
      description: "Instant support through our platform"
    }
  ];

  const faqItems = [
    {
      question: "How do I register my school?",
      answer: "Contact our support team or fill out the form below. We'll guide you through the registration process."
    },
    {
      question: "Is there a mobile app?",
      answer: "Yes! Mamashule is fully responsive and works perfectly on mobile devices. We're also developing native apps."
    },
    {
      question: "How secure is student data?",
      answer: "We use industry-standard encryption and security measures to protect all student and parent information."
    },
    {
      question: "What's the pricing?",
      answer: "We offer flexible pricing plans based on school size. Contact us for a customized quote."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-yellow-50 text-gray-800">
      <Navbar />
      
      {/* Background elements */}
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
        className="relative pt-32 pb-16 px-6"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black mb-6"
          >
            <span className="block bg-gradient-to-r from-purple-600 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Get in Touch
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto"
          >
            We're here to help you transform your school communication. Reach out to us!
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Info Grid */}
      <motion.section
        ref={infoRef}
        initial="hidden"
        animate={isInfoInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-16 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/70 backdrop-blur-lg border border-purple-200/50 rounded-2xl p-6 text-center hover:bg-white/90 transition-all duration-500 shadow-lg hover:shadow-xl group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-yellow-400 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500 shadow-md">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
                <p className="text-purple-600 font-semibold mb-2">{item.info}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Form and FAQ Section */}
      <motion.section
        ref={formRef}
        initial="hidden"
        animate={isFormInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="py-16 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <motion.div
              variants={slideVariants}
              className="bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-8 shadow-xl"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      I am a *
                    </label>
                    <select
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                    >
                      <option value="parent">Parent</option>
                      <option value="teacher">Teacher</option>
                      <option value="administrator">School Administrator</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                      placeholder="What's this about?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-100 border border-green-300 rounded-xl text-green-700"
                  >
                    ✅ Message sent successfully! We'll get back to you soon.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-100 border border-red-300 rounded-xl text-red-700"
                  >
                    ❌ Something went wrong. Please try again.
                  </motion.div>
                )}
              </form>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              variants={slideVariants}
              className="bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-8 shadow-xl"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-purple-200/50 rounded-xl p-4 hover:bg-white/50 transition-all duration-300"
                  >
                    <h3 className="font-bold text-gray-800 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 p-6 bg-gradient-to-br from-purple-100 to-yellow-100 rounded-xl border border-purple-200/50"
              >
                <h3 className="font-bold text-gray-800 mb-2">Need More Help?</h3>
                <p className="text-gray-600 mb-4">
                  Check out our comprehensive documentation and video tutorials.
                </p>
                <a
                  href="/docs"
                  className="inline-block bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-medium px-6 py-3 rounded-lg hover:from-purple-600 hover:to-yellow-600 transition-all duration-300"
                >
                  View Documentation
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Map Section (Placeholder) */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="bg-white/80 backdrop-blur-xl border border-purple-200/50 rounded-3xl p-8 shadow-xl"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-yellow-600 bg-clip-text text-transparent">
              Find Us
            </h2>
            <div className="bg-gradient-to-br from-purple-100 to-yellow-100 rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-xl text-gray-600 mb-4">We're located in the heart of Nairobi</p>
              <p className="text-gray-600">Interactive map coming soon!</p>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;