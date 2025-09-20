import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiUsers } from 'react-icons/fi';
import AddFriend from '../components/AddFriend';
import { getFriendsWithDetails, type FriendsResponseBody } from '../services/FriendService';

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
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [friends, setFriends] = useState<FriendsResponseBody[]>([]);
  const currentUserId:number = localStorage.getItem("id")
    ? parseInt(localStorage.getItem("id") || "0", 10)
    : 0;
    
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await getFriendsWithDetails(currentUserId);
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
          <div className="p-6 flex-shrink-0 space-x-10 flex items-center justify-between ">
            <h1 className="heading">
              👫 Your Friends
            </h1>
             {/* <p className="text-white/70 text-lg mb-6">Manage and track expenses with your groups</p> */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="modern-btn px-6 py-3 flex items-center gap-2"
              onClick={() => setIsAddFriendOpen(true)}
            >
              <FiPlus className="w-4 h-4" />
              Add Friend
            </motion.button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {friends.length > 0 ? (
              <div className="space-y-4">
                {friends.map((friend, index) => (
                <motion.div
                  key={friend.id}
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
                      <h3 className="text-white font-semibold text-lg">{friend.name}</h3>
                      {/* <p className='text-white/60'>Groups-</p> */}
                      {friend.groupsList?.length > 0 &&
                          friend.groupsList.map((group, idx) => (
                              <span
                                  key={idx}
                                  className="inline-block bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full mr-2 mt-1"
                              >
                                  {group}
                              </span>
                          ))}
                  </div>
                  </div>
                  <div className="flex-col items-center justify-end gap-3">
    {friend.owesYou > 0 ? (
        <p className="text-green-500 mb-3 text flex justify-end">Owes you - ${friend.owesYou}</p>
    ) : friend.youOwe > 0 ? (
        <p className="text-orange-300 text flex justify-end">You Owe - ${friend.youOwe}</p>
    ) : (
        <p className="text-white/60 text-sm flex justify-end">Settled</p>
    )}
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
        <AddFriend
          isOpen={isAddFriendOpen}
          onClose={() => setIsAddFriendOpen(false)}
          currentUserId={currentUserId}
        />
        </motion.div>
      </div>
    </div>
  );
};

export default Friends;
