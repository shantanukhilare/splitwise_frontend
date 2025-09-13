import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiPlus, FiArrowRight } from "react-icons/fi";
import CreateGroup from "../components/CreateGroup";
import { useNavigate } from "react-router-dom";
import { getGroupsByUserId, type Group } from "../services/groupService";

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

const Groups: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  // TODO: Replace with actual user id from auth context or props
  const currentUserId:number = localStorage.getItem("id")
    ? parseInt(localStorage.getItem("id") || "0", 10)
    : 0;
  const navigate = useNavigate();

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await getGroupsByUserId(currentUserId);
      setGroups(data);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line
  }, [currentUserId]);

  return (
    <div className="p-4 sm:p-6 pt-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-5 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl flex justify-between"
        >
          <h1 className="heading">
            🧑‍🤝‍🧑 Your Groups
          </h1>
          {/* <p className="text-white/70 text-lg mb-6">Manage and track expenses with your groups</p> */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="modern-btn px-6 py-3 flex items-center gap-2"
            onClick={() => setShowCreate(true)}
          >
            <FiPlus className="w-4 h-4" />
            Create New Group
          </motion.button>
        </motion.div>

        {/* Groups Content */}
        <motion.div 
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="modern-loader"></div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-white/70 text-lg"
              >
                Loading your groups...
              </motion.p>
            </div>
          ) : groups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group, index) => {
                return (
                  <motion.div
                    key={group.groupName}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.02, 
                      y: -5,
                      boxShadow: "0 20px 40px rgba(255,255,255,0.1)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-black flex justify-between item-center  border border-white/10 p-6 rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                    onClick={() =>
                      navigate(
                        `/groups/${encodeURIComponent(group.groupName)}?groupId=${
                          group.groupId || ""
                        }`
                      )
                    }
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-all duration-300">
                        <FiUsers className="w-6 h-6 text-purple-300" />
                      </div>
                      
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-200 transition-colors duration-300">
                      {group.groupName}
                    </h3>
                    <p className="text-white/60 text-sm">
                      {group.memberCount} {group.memberCount === 1 ? 'member' : 'members'}
                    </p>
                    <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <FiArrowRight className="w-5 h-5 text-white/60" />
                      </motion.div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-white/80 text-xl font-semibold mb-2">No groups yet</h3>
              <p className="text-white/60 mb-6">Create your first group to start splitting expenses</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="modern-btn px-6 py-3 flex items-center gap-2 mx-auto"
                onClick={() => setShowCreate(true)}
              >
                <FiPlus className="w-4 h-4" />
                Create Your First Group
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        <CreateGroup
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          currentUserId={currentUserId}
          onGroupCreated={fetchGroups}
        />
      </motion.div>
    </div>
  );
};

export default Groups;
