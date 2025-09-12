import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiDollarSign } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 pt-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
      
        {/* Header */}
        <motion.div 
          variants={cardVariants}
          className="text-center mb-12 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            ✨ Dashboard Overview
          </h1>
          <p className="text-white/70 text-lg">Track your expenses and balances</p>
        </motion.div>

        {/* Balance Cards */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {/* You Owe */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02, 
              y: -5,
              boxShadow: "0 25px 50px rgba(239, 68, 68, 0.15)"
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-red-500/10 backdrop-blur-xl rounded-2xl p-6 border border-red-400/20 shadow-xl cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl group-hover:bg-red-500/30 transition-all duration-300">
                <FiTrendingDown className="w-6 h-6 text-red-300" />
              </div>
              <motion.div 
                className="text-2xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                📤
              </motion.div>
            </div>
            <h3 className="text-lg font-semibold text-red-200 mb-2">You Owe</h3>
            <motion.p 
              className="text-3xl font-bold text-red-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              ₹1,200
            </motion.p>
          </motion.div>

          {/* You Are Owed */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02, 
              y: -5,
              boxShadow: "0 25px 50px rgba(34, 197, 94, 0.15)"
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-green-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-400/20 shadow-xl cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-all duration-300">
                <FiTrendingUp className="w-6 h-6 text-green-300" />
              </div>
              <motion.div 
                className="text-2xl"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                📥
              </motion.div>
            </div>
            <h3 className="text-lg font-semibold text-green-200 mb-2">You Are Owed</h3>
            <motion.p 
              className="text-3xl font-bold text-green-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
            >
              ₹2,500
            </motion.p>
          </motion.div>

          {/* Net Balance */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.02, 
              y: -5,
              boxShadow: "0 25px 50px rgba(168, 85, 247, 0.15)"
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-purple-500/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-400/20 shadow-xl cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-all duration-300">
                <FiDollarSign className="w-6 h-6 text-purple-300" />
              </div>
              <motion.div 
                className="text-2xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity, repeatDelay: 2 },
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" }
                }}
              >
                💰
              </motion.div>
            </div>
            <h3 className="text-lg font-semibold text-purple-200 mb-2">Net Balance</h3>
            <motion.p 
              className="text-3xl font-bold text-purple-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: "spring" }}
            >
              +₹1,300
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          variants={cardVariants}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            📝 Recent Activity
          </h3>
          <motion.div 
            variants={containerVariants}
            className="space-y-4"
          >
            {[
              { user: "You", action: "paid", target: "Alex", amount: "₹500", description: "for Dinner 🍽️", color: "blue" },
              { user: "Priya", action: "added an expense:", target: "", amount: "₹1,200", description: "for Trip 🧳", color: "purple" },
              { user: "You", action: "settled up with", target: "Sam", amount: "", description: "✅", color: "green" }
            ].map((activity, index) => (
              <motion.div 
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  x: 5, 
                  scale: 1.02,
                  boxShadow: "0 10px 25px rgba(255,255,255,0.1)"
                }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-xl transition-all duration-300 cursor-pointer hover:bg-white/10"
              >
                <span className="text-white/90">
                  <strong className="text-blue-300">{activity.user}</strong> {activity.action} 
                  {activity.target && <strong className="text-blue-300">{activity.target}</strong>}
                  {activity.amount && <span className="text-yellow-300 font-semibold"> {activity.amount} </span>}
                  <span className="text-white/70">{activity.description}</span>
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
