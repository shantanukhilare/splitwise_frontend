import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers } from 'react-icons/fi';
import { friendsNames  } from '../services/groupService';

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      delay: i * 0.1,
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    },
  }),
};

const Friends: React.FC = () => {
  const [friends, setFriends] = useState<string[]>([]);
  const currentUserId:number = localStorage.getItem("id")
    ? parseInt(localStorage.getItem("id") || "0", 10)
    : 0;
    
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await friendsNames(currentUserId);
        setFriends(response);
      } catch (err) {
        setFriends([]);
        console.log('error-> ', err);
      }
    };

    fetchFriends();
  }, [currentUserId]);


  return (
    <div className="flex flex-col">
      <div className="flex-1 p-4 sm:p-6 pt-24 flex flex-col">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto flex-1 flex flex-col min-h-0"
        >
        <motion.div 
          className="bg-black/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl flex-1 flex flex-col min-h-0"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6 flex-shrink-0">
            <h1 className="heading">
              👫 Your Friends
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {friends.length > 0 ? (
              <div className="space-y-4">
                {friends.map((friend, index) => (
                <motion.div
                  key={friend}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.02, 
                    x: 5,
                    boxShadow: "0 10px 25px rgba(255,255,255,0.1)"
                  }}
                  className="flex items-center justify-between bg-black backdrop-blur-sm border border-black/10 p-5 rounded-xl transition-all duration-300 cursor-pointer hover:bg-white/10 group"
                >
                  <div className="flex items-center gap-4 ">
                    <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-all duration-300">
                      <FiUsers className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{friend}</h3>
                      <p className="text-white/60 text-sm">Friend</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-sm">Active</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-white/80 text-xl font-semibold mb-2">No friends yet</h3>
                <p className="text-white/60">Add friends to start splitting expenses together</p>
              </motion.div>
            )}
          </div>
        </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Friends;
