import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      // Add your signup API call here
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      toast.error("Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 glass-effect"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold text-center mb-8 gradient-text"
          >
            Create Account
          </motion.h1>

          <motion.form onSubmit={handleSubmit} variants={itemVariants} className="space-y-6">
            <div className="modern-input-group">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="modern-input"
              />
              <label className="modern-label">Full Name</label>
            </div>

            <div className="modern-input-group">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="modern-input"
              />
              <label className="modern-label">Email Address</label>
            </div>

            <div className="modern-input-group">
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="modern-input"
              />
              <label className="modern-label">Password</label>
            </div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="modern-btn w-full relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="modern-loader mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </motion.form>

          <motion.div 
            variants={itemVariants}
            className="mt-6 text-center"
          >
            <p className="text-white/70">
              Already have an account?{" "}
              <motion.a
                href="/login"
                className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                Sign in
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
