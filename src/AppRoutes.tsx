import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Friends from './pages/Friends';
import AddExpense from './pages/AddExpense';
import Navbar from './components/Navbar';
import GroupDashboard from './pages/GroupDashboard';
import lottieBackground from './assets/lottie-backgrounnd.json';


const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  const pageVariants = {
    initial: {
      opacity: 0,
      scale: 0.9,
      rotateX: -10
    },
    in: {
      opacity: 1,
      scale: 1,
      rotateX: 0
    },
    out: {
      opacity: 0,
      scale: 1.05,
      rotateX: 10
    }
  };
  
  const pageTransition = {
    duration: 0.5
  };
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Login />
          </motion.div>
        } />
        <Route path="/signup" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Signup />
          </motion.div>
        } />
        <Route path="/dashboard" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Dashboard />
          </motion.div>
        } />
        <Route path="/groups" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Groups />
          </motion.div>
        } />
        <Route path="/groups/:groupName" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <GroupDashboard />
          </motion.div>
        } />
        <Route path="/friends" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Friends />
          </motion.div>
        } />
        <Route path="/add-expense" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <AddExpense />
          </motion.div>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
            {/* 🖤 Black Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000000',
          zIndex: -2,
        }}
      />
      {/* 🎬 Lottie Animated Background */}
      <DotLottieReact
        data={lottieBackground}
        autoplay
        loop
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          opacity: 0.8,
        }}
      />
      <Navbar />
      <div className='pt-16 sm:pt-20'>
        <AnimatedRoutes />
      </div>
    </Router>
  );
};

export default AppRoutes;
