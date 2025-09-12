import { toast } from "react-toastify";
import { userLogin } from "../services/userService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!credentials || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await userLogin(credentials, password);
      localStorage.setItem("userName", response.name);
      localStorage.setItem("id", response.id.toString());
      localStorage.setItem("email", response.email);
      localStorage.setItem("phoneNumber", response.phoneNumber);
      toast.success("Login successful");
      navigate("/groups");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed");
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md mx-4 sm:mx-0"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 glass-effect relative z-10"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-bold text-center mb-8 gradient-text"
          >
            Welcome Back
          </motion.h1>

          <motion.div variants={itemVariants} className="space-y-6">
            <div className="modern-input-group">
              <input
                type="text"
                required
                value={credentials}
                onChange={(e) => setCredentials(e.target.value)}
                className="modern-input"
                placeholder=" "
              />
              <label className="modern-label">Username or Email</label>
            </div>

            <div className="modern-input-group">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="modern-input"
                placeholder=" "
              />
              <label className="modern-label">Password</label>
            </div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={isLoading}
              className="modern-btn w-full relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="modern-loader mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="mt-6 text-center"
          >
            <p className="text-white/70">
              Don't have an account?{" "}
              <motion.a
                href="/signup"
                className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                whileHover={{ scale: 1.05 }}
              >
                Sign up
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
