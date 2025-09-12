import React from "react";
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaUser, FaUsers, FaFileAlt } from "react-icons/fa";

const AddExpense: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto mt-6 sm:mt-10 p-4 sm:p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-violet-600 via-black to-violet-600 mx-4 sm:mx-auto"
    >
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 bg-gradient-to-r from-teal-100 to-green-100 animate-pulse text-transparent bg-clip-text flex items-center justify-center gap-2">
        <FaMoneyBillWave className="text-green-500 mr-2 sm:mr-3 text-2xl sm:text-3xl" />
         Add Expense
      </h2>

      <motion.form 
        className="space-y-4 sm:space-y-6"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="modern-input-group"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
        >
          <input type="text" required className="modern-input text-gray-800" />
          <label className="modern-label flex items-center gap-2">
            <FaFileAlt className="text-teal-500" />
            Description
          </label>
        </motion.div>

        <motion.div 
          className="modern-input-group"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
        >
          <input type="number" required className="modern-input text-gray-800" />
          <label className="modern-label flex items-center gap-2">
            <FaMoneyBillWave className="text-green-500" />
            Amount
          </label>
        </motion.div>

        <motion.div 
          className="modern-input-group"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
        >
          <input type="text" required className="modern-input text-gray-800" />
          <label className="modern-label flex items-center gap-2">
            <FaUser className="text-blue-500" />
            Paid By
          </label>
        </motion.div>

        <motion.div 
          className="modern-input-group"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
        >
          <input type="text" required className="modern-input text-gray-800" />
          <label className="modern-label flex items-center gap-2">
            <FaUsers className="text-purple-500" />
            Split With
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="modern-btn w-full mt-6 sm:mt-8"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <span className="flex items-center justify-center gap-2">
            ✨ Add Expense
          </span>
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default AddExpense;
