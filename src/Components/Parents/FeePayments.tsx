import React, { useState, useEffect } from 'react';

interface Child {
  _id: string;
  name: string;
}

interface FeePayment {
  _id: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  studentId: Child;
}

export const FeePayment: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [academicTerm, setAcademicTerm] = useState<string>('');
  const [children, setChildren] = useState<Child[]>([]);
  const [feeHistory, setFeeHistory] = useState<FeePayment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Fetch parent's children if role is parent
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get children (for parents) or all students (for admins)
        if (role === 'parent') {
       
          const response = await fetch(`https://mama-shule.onrender.com/api/children/my-children`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const childrenData = await response.json();
          console.log('Fetched children:', childrenData);
          setChildren(childrenData);
          if (childrenData.length > 0) {
            setStudentId(childrenData[0]._id);
          }
        }

        // Get fee history
        const historyResponse = await fetch('https://mama-shule.onrender.com/api/fees/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const historyData = await historyResponse.json();
        setFeeHistory(historyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('token');
      const response = await fetch('https://mama-shule.onrender.com/api/fees/pay', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          studentId,
          paymentMethod,
          academicTerm
        })
      });
      
      const result = await response.json();
      console.log('Payment response:', result); 
      setSuccess('Payment successful!');
      
      // Clear form
      setAmount('');
      setAcademicTerm('');
      
      // Refresh history
      const historyResponse = await fetch('https://mama-shule.onrender.com/api/fees/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const historyData = await historyResponse.json();
      setFeeHistory(historyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  if (loading && children.length === 0 && feeHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center animate-pulse-soft">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gradient border-indigo-200 border-t-indigo-600 mb-6 shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 animate-ping"></div>
          </div>
          <p className="text-indigo-700 font-semibold text-lg animate-fade-in-delay">Loading payment system...</p>
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-15 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-gradient-to-r from-pink-200 to-indigo-200 rounded-full opacity-25 animate-float-slow"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 animate-fade-in-down">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
            School Fee Payment
          </h1>
          <p className="text-indigo-600 text-base sm:text-lg lg:text-xl font-medium max-w-2xl mx-auto">
            Secure • Convenient • Instant Payment Portal
          </p>
        </div>

        <div className="grid xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Payment Form */}
          <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 hover:shadow-3xl transition-all duration-500 animate-slide-in-left group">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="w-1.5 h-10 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full mr-4 group-hover:h-12 transition-all duration-300"></div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Make Payment</h2>
            </div>
            
            {/* Alert Messages */}
            {error && (
              <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl animate-shake-gentle">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-red-700 font-semibold text-sm sm:text-base">{error}</p>
                </div>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl animate-success-bounce">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="ml-3 text-green-700 font-semibold text-sm sm:text-base">{success}</p>
                </div>
              </div>
            )}

            <div className="space-y-6 sm:space-y-8">
              {/* Student Selection */}
              <div className="space-y-3">
                <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
                  Select Student
                </label>
                <div className="relative group">
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 appearance-none cursor-pointer text-sm sm:text-base font-medium hover:border-indigo-300 group-hover:shadow-lg"
                    disabled={children.length === 0}
                  >
                    {children.map(child => (
                      <option key={child._id} value={child._id}>{child.name}</option>
                    ))}
                    {children.length === 0 && <option value="">No students found</option>}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 sm:px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Academic Term */}
              <div className="space-y-3">
                <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
                  Academic Term
                </label>
                <div className="relative group">
                  <select
                    value={academicTerm}
                    onChange={(e) => setAcademicTerm(e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 appearance-none cursor-pointer text-sm sm:text-base font-medium hover:border-indigo-300 group-hover:shadow-lg"
                  >
                    <option value="">Select Term</option>
                    <option value="Term 1">Term 1</option>
                    <option value="Term 2">Term 2</option>
                    <option value="Term 3">Term 3</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 sm:px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-3">
                <label className="block text-sm sm:text-base font-bold text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                    <span className="text-indigo-600 font-bold text-sm sm:text-base">KES</span>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-16 sm:pl-20 pr-4 sm:pr-5 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300 text-sm sm:text-base font-medium hover:border-indigo-300 group-hover:shadow-lg"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <label className="block text-sm sm:text-base font-bold text-gray-700">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <label className={`relative flex items-center p-4 sm:p-5 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 transform ${
                    paymentMethod === 'mpesa' 
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                  }`}>
                    <input
                      type="radio"
                      checked={paymentMethod === 'mpesa'}
                      onChange={() => setPaymentMethod('mpesa')}
                      className="sr-only"
                    />
                    <div className="flex items-center w-full">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center transition-all duration-200 ${
                        paymentMethod === 'mpesa' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'mpesa' && (
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full animate-scale-in"></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-gray-700 text-sm sm:text-base">M-Pesa</span>
                        <div className="text-green-600 text-xl sm:text-2xl">💚</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`relative flex items-center p-4 sm:p-5 border-2 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 transform ${
                    paymentMethod === 'card' 
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg' 
                      : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
                  }`}>
                    <input
                      type="radio"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="sr-only"
                    />
                    <div className="flex items-center w-full">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center transition-all duration-200 ${
                        paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'card' && (
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-full animate-scale-in"></div>
                        )}
                      </div>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-gray-700 text-sm sm:text-base">Card</span>
                        <div className="text-blue-600 text-xl sm:text-2xl">💳</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePayment}
                disabled={!amount || !studentId || !academicTerm || loading}
                className={`w-full py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-bold text-white transition-all duration-500 transform hover:scale-105 focus:ring-4 focus:ring-offset-2 text-sm sm:text-base lg:text-lg ${
                  (!amount || !studentId || !academicTerm || loading)
                    ? 'bg-gradient-to-r from-gray-300 to-gray-400 cursor-not-allowed transform-none hover:scale-100'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:ring-indigo-300 shadow-xl hover:shadow-2xl animate-gradient'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent mr-2 sm:mr-3"></div>
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Pay School Fees Securely</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 hover:shadow-3xl transition-all duration-500 animate-slide-in-right group">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="w-1.5 h-10 bg-gradient-to-b from-pink-500 via-purple-500 to-indigo-500 rounded-full mr-4 group-hover:h-12 transition-all duration-300"></div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Payment History</h3>
            </div>
            
            {feeHistory.length === 0 ? (
              <div className="text-center py-8 sm:py-12 lg:py-16 animate-fade-in-up">
                <div className="relative mx-auto mb-6 sm:mb-8">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center animate-pulse-soft">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 opacity-30 animate-ping"></div>
                </div>
                <p className="text-gray-600 font-bold text-lg sm:text-xl mb-2">No payment history found</p>
                <p className="text-gray-500 text-sm sm:text-base">Your payment records will appear here after your first transaction</p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6 max-h-96 sm:max-h-[28rem] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100">
                {feeHistory.map((payment, index) => (
                  <div 
                    key={payment._id} 
                    className="bg-gradient-to-r from-white via-indigo-50 to-purple-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-indigo-100 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up group cursor-pointer"
                    style={{animationDelay: `${index * 150}ms`}}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-3 sm:mb-0">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          <h4 className="font-bold text-gray-800 text-base sm:text-lg">
                            {payment.studentId?.name || 'N/A'}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">
                          {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          KES {payment.amount.toLocaleString()}
                        </p>
                        <div className="flex items-center mt-1 sm:justify-end">
                          <p className="text-xs sm:text-sm text-gray-500 font-semibold capitalize mr-2">
                            via {payment.paymentMethod}
                          </p>
                          <span className="text-lg">{payment.paymentMethod === 'mpesa' ? '💚' : '💳'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-indigo-200">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400 font-mono truncate">
                          ID: {payment.transactionId}
                        </p>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full group-hover:bg-indigo-600 transition-colors duration-200"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-down {
          from { 
            opacity: 0; 
            transform: translateY(-30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slide-in-left {
          from { 
            opacity: 0; 
            transform: translateX(-60px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
          }
        }
        
        @keyframes slide-in-right {
          from { 
            opacity: 0; 
            transform: translateX(60px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
          }
        }
        
        @keyframes success-bounce {
          0% { 
            opacity: 0; 
            transform: scale(0.8) rotate(-5deg); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.05) rotate(2deg); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
          }
        }
        
        @keyframes shake-gentle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px) rotate(-1deg); }
          75% { transform: translateX(3px) rotate(1deg); }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        @keyframes scale-in {
          from { 
            transform: scale(0); 
          }
          to { 
            transform: scale(1); 
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(5deg); 
          }
        }
        
        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-15px) rotate(-3deg); 
          }
        }
        
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-10px) rotate(2deg); 
          }
        }
        
        @keyframes pulse-soft {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.05); 
          }
        }
        
        @keyframes fade-in-delay {
          0% { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          50% { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-fade-in-down { 
          animation: fade-in-down 0.8s ease-out; 
        }
        
        .animate-slide-in-left { 
          animation: slide-in-left 1s ease-out; 
        }
        
        .animate-slide-in-right { 
          animation: slide-in-right 1s ease-out 0.2s both; 
        }
        
        .animate-success-bounce { 
          animation: success-bounce 0.6s ease-out; 
        }
        
        .animate-shake-gentle { 
          animation: shake-gentle 0.6s ease-out; 
        }
        
        .animate-fade-in-up { 
          animation: fade-in-up 0.8s ease-out both; 
        }
        
        .animate-scale-in { 
          animation: scale-in 0.3s ease-out; 
        }
        
        .animate-float { 
          animation: float 6s ease-in-out infinite; 
        }
        
        .animate-float-delayed { 
          animation: float-delayed 8s ease-in-out infinite 2s; 
        }
        
        .animate-float-slow { 
          animation: float-slow 10s ease-in-out infinite 1s; 
        }
        
        .animate-pulse-soft { 
          animation: pulse-soft 2s ease-in-out infinite; 
        }
        
        .animate-fade-in-delay { 
          animation: fade-in-delay 2s ease-out; 
        }
        
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-indigo-300::-webkit-scrollbar-thumb {
          background-color: rgb(165 180 252);
          border-radius: 3px;
        }
        
        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: rgb(243 244 246);
        }
        
        @media (max-width: 640px) {
          .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        @media (max-width: 1280px) {
          .xl\\:grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
      `}
      </style>
    </div>
  );
}
export default FeePayment;