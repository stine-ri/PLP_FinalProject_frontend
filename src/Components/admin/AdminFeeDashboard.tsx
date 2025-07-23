import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface FeePayment {
  _id: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: string;
  paymentDate: string;
  academicTerm: string;
  studentId: {
    _id: string;
    name: string;
  };
  paidBy: {
    _id: string;
    name: string;
    email?: string;
  };
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

const pulse = {
  scale: [1, 1.02, 1],
  transition: { duration: 1.5, repeat: Infinity }
};

export const AdminFeeDashboard = () => {
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    term: '',
    method: '',
    status: '',
    fromDate: '',
    toDate: ''
  });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const response = await axios.get(`http://localhost:5000/api/fees/history?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setPayments(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch payments');
        } else {
          setError('An unexpected error occurred');
        }
      }
      setLoading(false);
    };

    fetchPayments();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: new Date(value).toISOString() }));
  };

  const handleResetFilters = () => {
    setFilters({
      term: '',
      method: '',
      status: '',
      fromDate: '',
      toDate: ''
    });
  };

  const togglePaymentExpand = (id: string) => {
    setExpandedPayment(expandedPayment === id ? null : id);
  };

  const calculateTotals = () => {
    return payments.reduce((acc, payment) => {
      acc.totalAmount += payment.amount;
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
      return acc;
    }, { totalAmount: 0 } as Record<string, number>);
  };

  const totals = calculateTotals();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <motion.div 
        animate={pulse}
        className="text-center p-8 rounded-lg"
      >
        <div className="w-16 h-16 border-4 border-purple-500 border-t-yellow-400 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-purple-800 font-medium">Loading payments...</p>
      </motion.div>
    </div>
  );

  if (error) return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="p-8 text-center text-red-500 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10"
    >
      <div className="text-2xl mb-2">⚠️</div>
      {error}
    </motion.div>
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="p-4 md:p-8 bg-gradient-to-br from-purple-50 to-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          variants={slideUp}
          className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-purple-900"
        >
          Fee Payments Dashboard
        </motion.h1>
        
        {/* Filters Section */}
        <motion.div 
          variants={slideUp}
          className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6 md:mb-8 border border-purple-100"
        >
          <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-purple-800">Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-medium text-purple-700 mb-1">Academic Term</label>
              <select
                name="term"
                value={filters.term}
                onChange={handleFilterChange}
                className="w-full text-xs md:text-sm rounded-lg border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                <option value="">All Terms</option>
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs md:text-sm font-medium text-purple-700 mb-1">Payment Method</label>
              <select
                name="method"
                value={filters.method}
                onChange={handleFilterChange}
                className="w-full text-xs md:text-sm rounded-lg border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                <option value="">All Methods</option>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs md:text-sm font-medium text-purple-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full text-xs md:text-sm rounded-lg border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="successful">Successful</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs md:text-sm font-medium text-purple-700 mb-1">From Date</label>
              <input
                type="date"
                name="fromDate"
                onChange={handleDateFilterChange}
                className="w-full text-xs md:text-sm rounded-lg border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-xs md:text-sm font-medium text-purple-700 mb-1">To Date</label>
              <input
                type="date"
                name="toDate"
                onChange={handleDateFilterChange}
                className="w-full text-xs md:text-sm rounded-lg border-purple-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              />
            </div>
          </div>
          
          <div className="mt-4 md:mt-6 flex justify-end space-x-2 md:space-x-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetFilters}
              className="px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Reset Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div 
          variants={slideUp}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8"
        >
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white p-3 md:p-5 rounded-xl shadow-md border-t-4 border-purple-500"
          >
            <h3 className="text-xs md:text-sm font-medium text-purple-600">Total Payments</h3>
            <p className="text-lg md:text-2xl font-bold text-purple-900 mt-1">{payments.length}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white p-3 md:p-5 rounded-xl shadow-md border-t-4 border-yellow-400"
          >
            <h3 className="text-xs md:text-sm font-medium text-purple-600">Total Amount</h3>
            <p className="text-lg md:text-2xl font-bold text-purple-900 mt-1">KES {totals.totalAmount?.toLocaleString() || 0}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white p-3 md:p-5 rounded-xl shadow-md border-t-4 border-purple-400"
          >
            <h3 className="text-xs md:text-sm font-medium text-purple-600">M-Pesa Total</h3>
            <p className="text-lg md:text-2xl font-bold text-purple-900 mt-1">KES {(totals.mpesa || 0).toLocaleString()}</p>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white p-3 md:p-5 rounded-xl shadow-md border-t-4 border-yellow-500"
          >
            <h3 className="text-xs md:text-sm font-medium text-purple-600">Card Payments</h3>
            <p className="text-lg md:text-2xl font-bold text-purple-900 mt-1">KES {(totals.card || 0).toLocaleString()}</p>
          </motion.div>
        </motion.div>

        {/* Payments Table */}
        <motion.div 
          variants={slideUp}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100"
        >
          {isMobileView ? (
            /* Mobile Cards View */
            <div className="divide-y divide-purple-100">
              {payments.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-purple-500">
                  No payments found matching your filters
                </div>
              ) : (
                payments.map((payment, index) => (
                  <motion.div 
                    key={payment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-purple-50 transition-colors"
                    onClick={() => togglePaymentExpand(payment._id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-purple-800">
                          {payment.studentId?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-purple-600">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-purple-900">
                          KES {payment.amount.toLocaleString()}
                        </p>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          payment.status === 'successful' 
                            ? 'bg-green-100 text-green-800' 
                            : payment.status === 'failed' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>

                    {expandedPayment === payment._id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 pt-3 border-t border-purple-100"
                      >
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-purple-500">Parent</p>
                            <p className="text-purple-800">{payment.paidBy?.name || 'N/A'}</p>
                            {payment.paidBy?.email && (
                              <p className="text-purple-600">{payment.paidBy.email}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-purple-500">Term</p>
                            <p className="text-purple-800">{payment.academicTerm}</p>
                          </div>
                          <div>
                            <p className="text-purple-500">Method</p>
                            <p className="text-purple-800 capitalize">{payment.paymentMethod}</p>
                          </div>
                          <div>
                            <p className="text-purple-500">Transaction ID</p>
                            <p className="text-purple-800 font-mono truncate">{payment.transactionId}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            /* Desktop Table View */
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-200">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-purple-700 uppercase tracking-wider">Date</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-purple-700 uppercase tracking-wider">Student</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-purple-700 uppercase tracking-wider">Parent</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-purple-700 uppercase tracking-wider">Term</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-purple-700 uppercase tracking-wider">Amount</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-purple-700 uppercase tracking-wider">Method</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-purple-700 uppercase tracking-wider">Status</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-purple-700 uppercase tracking-wider">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-purple-100">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-sm text-purple-500">
                        No payments found matching your filters
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment, index) => (
                      <motion.tr 
                        key={payment._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-purple-50 transition-colors"
                      >
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-purple-900">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-purple-800 font-medium">
                          {payment.studentId?.name || 'N/A'}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-purple-800">
                          {payment.paidBy?.name || 'N/A'}
                          {payment.paidBy?.email && (
                            <div className="text-xs text-purple-500">{payment.paidBy.email}</div>
                          )}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-purple-700">
                          {payment.academicTerm}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-bold text-purple-900">
                          KES {payment.amount.toLocaleString()}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm capitalize text-purple-700">
                          {payment.paymentMethod}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 md:px-3 py-1 text-xs rounded-full font-medium ${
                            payment.status === 'successful' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status === 'failed' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-mono text-purple-600 truncate max-w-[120px]">
                          {payment.transactionId}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Export Button */}
        <motion.div 
          variants={slideUp}
          className="mt-4 md:mt-6 flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: '#6b46c1' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const csvContent = [
                ['Date', 'Student', 'Parent', 'Term', 'Amount', 'Method', 'Status', 'Transaction ID'],
                ...payments.map(p => [
                  new Date(p.paymentDate).toLocaleDateString(),
                  p.studentId?.name || 'N/A',
                  p.paidBy?.name || 'N/A',
                  p.academicTerm,
                  p.amount,
                  p.paymentMethod,
                  p.status,
                  p.transactionId
                ])
              ].map(e => e.join(',')).join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', `fee-payments-${new Date().toISOString()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export to CSV
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};