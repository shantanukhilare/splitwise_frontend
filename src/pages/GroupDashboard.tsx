import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUserFriends, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getGroupMembers,
  type GroupMembersResponseBody,
} from '../services/groupService';
import {
  getGroupWiseAmountsIOwe,
  getGroupWiseAmountsOwedToMe,
  addExpense,
  addUnevenExpense,
  type UserBalanceDto,
  type CreateEvenExpenseRequestBody,
  type CreateUnevenExpenseRequestBody,
  type unevenAmounts,
} from '../services/ExpenseService';
import AddMember from '../components/AddMember';

const GroupDashboard: React.FC = () => {
  const { groupName } = useParams<{ groupName: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUserId:number = localStorage.getItem("id")
    ? parseInt(localStorage.getItem("id") || "0", 10)
    : 0;

  // Get groupId from query param
  const groupId = React.useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('groupId') || '';
  }, [location.search]);

  // State
  const [members, setMembers] = useState<GroupMembersResponseBody[]>([]);
  const [whoIOwe, setWhoIOwe] = useState<UserBalanceDto[]>([]);
  const [whoOwesMe, setWhoOwesMe] = useState<UserBalanceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    paidByUserId: currentUserId,
    selectedMembers: [] as number[],
    selectAll: false
  });
  const [submittingExpense, setSubmittingExpense] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch members
        const groupMembers = await getGroupMembers(groupId ? parseInt(groupId) : 0);
        setMembers(groupMembers);

        if (groupId) {
          // Fetch balances
          const ioWeData = await getGroupWiseAmountsIOwe(parseInt(groupId), currentUserId);
          const owedToMeData = await getGroupWiseAmountsOwedToMe(parseInt(groupId), currentUserId);

          setWhoIOwe(ioWeData);
          setWhoOwesMe(owedToMeData);
        }
      } catch (err) {
        console.error(err);
        setWhoIOwe([]);
        setWhoOwesMe([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [groupId, currentUserId]);

  // Compute net balance per member
  const memberNetBalances = members
    .filter((m) => m.id !== currentUserId)
    .map((member) => {
      const owesMe = whoOwesMe.find((item) => item.userId === member.id)?.amount ?? 0;
      const iOwe = whoIOwe.find((item) => item.userId === member.id)?.amount ?? 0;
      return {
        ...member,
        netAmount: owesMe - iOwe, // positive = they owe you, negative = you owe them
      };
    });

  const totalIOwe = whoIOwe.reduce((sum, i) => sum + i.amount, 0);
  const totalOwedToMe = whoOwesMe.reduce((sum, i) => sum + i.amount, 0);
  const netBalance = totalOwedToMe - totalIOwe;

  // Handle member selection
  const handleMemberSelection = (memberId: number, checked: boolean) => {
    setExpenseForm(prev => {
      let newSelectedMembers;
      if (checked) {
        newSelectedMembers = [...prev.selectedMembers, memberId];
      } else {
        newSelectedMembers = prev.selectedMembers.filter(id => id !== memberId);
      }
      
      const allMemberIds = members.map(m => m.id);
      const isSelectAll = allMemberIds.every(id => newSelectedMembers.includes(id));
      
      return {
        ...prev,
        selectedMembers: newSelectedMembers,
        selectAll: isSelectAll
      };
    });
  };

  // Handle select all toggle
  const handleSelectAllToggle = (checked: boolean) => {
    setExpenseForm(prev => ({
      ...prev,
      selectAll: checked,
      selectedMembers: checked ? members.map(m => m.id) : []
    }));
  };

  // Handle expense form submission
  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.description || !expenseForm.amount || !groupId || expenseForm.selectedMembers.length === 0) {
      toast.error('Please fill in all fields and select at least one member');
      return;
    }

    setSubmittingExpense(true);
    try {
      const allMemberIds = members.map(m => m.id);
      const isEvenlySplit = expenseForm.selectAll || 
        (expenseForm.selectedMembers.length === allMemberIds.length && 
         allMemberIds.every(id => expenseForm.selectedMembers.includes(id)));

      if (isEvenlySplit) {
        // Use evenly split API
        const payload: CreateEvenExpenseRequestBody = {
          groupId: parseInt(groupId),
          userId: expenseForm.paidByUserId,
          description: expenseForm.description,
          amount: parseFloat(expenseForm.amount),
          splitType: 'EVENLY'
        };
        await addExpense(payload);
      } else {
        // For uneven split, create separate expense for each selected member
        const totalAmount = parseFloat(expenseForm.amount);
        const perMemberAmount = totalAmount / expenseForm.selectedMembers.length;
        
        // Create expense for each selected member
        for (const memberId of expenseForm.selectedMembers) {
          const unevenAmounts: unevenAmounts = {
            userId: memberId,
            amount: perMemberAmount
          };

          const payload: CreateUnevenExpenseRequestBody = {
            groupId: parseInt(groupId),
            paidByUserId: expenseForm.paidByUserId,
            description: expenseForm.description,
            unevenAmounts: unevenAmounts,
            type: 'UNEVENLY'
          };
          await addUnevenExpense(payload);
        }
      }

      toast.success('Expense added successfully!');
      setShowAddExpense(false);
      setExpenseForm({ 
        description: '', 
        amount: '', 
        paidByUserId: currentUserId,
        selectedMembers: [],
        selectAll: false
      });
      
      // Refresh data
      const groupMembers = await getGroupMembers(parseInt(groupId));
      setMembers(groupMembers);
      const ioWeData = await getGroupWiseAmountsIOwe(parseInt(groupId), currentUserId);
      const owedToMeData = await getGroupWiseAmountsOwedToMe(parseInt(groupId), currentUserId);
      setWhoIOwe(ioWeData);
      setWhoOwesMe(owedToMeData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add expense');
    } finally {
      setSubmittingExpense(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header Section */}
          <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ x: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="modern-btn group rounded-full relative flex items-center overflow-hidden hover:w-auto w-12 transition-all duration-700"
                    onClick={() => navigate(-1)}
                  >
                    <FaArrowLeft className="text-lg transition-transform duration-700 group-hover:-translate-x-1 flex-shrink-0" />
                    <span className="ml-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-700 max-w-0 group-hover:max-w-xs overflow-hidden">
                      Back to Groups
                    </span>
                  </motion.button>
                  <h1 className="heading">
                    {groupName}
                  </h1>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="modern-btn"
                  onClick={() => setShowAddExpense(true)}
                >
                  <FaPlus className="text-lg" />
                  <span> Add Expense</span>
                </motion.button>
              </div>

              {loading ? (
                <div className="text-center text-gray-400 py-10">Loading group dashboard...</div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-red-500/10 backdrop-blur-xl rounded-xl p-4 border border-red-400/20 shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-black to-red-900"></div>
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">-</span>
                        </div>
                        <div>
                          <p className="text-red-300 font-semibold text-xs uppercase tracking-wide">You Owe</p>
                          <p className="text-2xl font-black text-red-200">₹{totalIOwe}</p>
                        </div>
                      </div>
                    </motion.div>
                  
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="bg-green-500/10 backdrop-blur-xl rounded-xl p-4 border border-green-400/20 shadow-lg relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-black to-green-800"></div>
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">+</span>
                        </div>
                        <div>
                          <p className="text-green-300 font-semibold text-xs uppercase tracking-wide">Owed To You</p>
                          <p className="text-2xl font-black text-green-200">₹{totalOwedToMe}</p>
                        </div>
                      </div>
                    </motion.div>
                  
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className={`backdrop-blur-xl rounded-xl p-4 border shadow-lg relative overflow-hidden ${
                        netBalance > 0 
                          ? 'bg-emerald-500/10 border-emerald-400/20' 
                          : netBalance < 0 
                          ? 'bg-orange-500/10 border-orange-400/20'
                          : 'bg-gray-500/10 border-gray-400/20'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${
                        netBalance > 0 
                          ? 'from-emerald-900 via-black to-emerald-800' 
                          : netBalance < 0 
                          ? 'from-orange-900 via-black to-orange-800'
                          : 'from-gray-900 via-black to-gray-800'
                      }`}></div>
                      <div className="relative z-10 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          netBalance > 0 
                            ? 'bg-emerald-500' 
                            : netBalance < 0 
                            ? 'bg-orange-500'
                            : 'bg-gray-500'
                        }`}>
                          <span className="text-white font-bold text-lg">=</span>
                        </div>
                        <div>
                          <p className={`font-semibold text-xs uppercase tracking-wide ${
                            netBalance > 0 
                              ? 'text-emerald-300' 
                              : netBalance < 0 
                              ? 'text-orange-300'
                              : 'text-gray-300'
                          }`}>Net Balance</p>
                          <p className={`text-2xl font-black ${
                            netBalance > 0 
                              ? 'text-emerald-200' 
                              : netBalance < 0 
                              ? 'text-orange-200'
                              : 'text-gray-200'
                          }`}>
                            ₹{Math.abs(netBalance)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Member Balances Section */}
          <div className="bg-black/30 backdrop-blur-sm rounded-3xl shadow-xl p-8">
              <div className='flex items-center justify-between mb-8'>
                <h2 className="heading">
                  👥 Group Members
                </h2>
                <motion.button 
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className='modern-btn'
                  onClick={() => setShowCreate(true)}
                >
                  <FaPlus className="text-lg" />
                  <span>Add Member</span>
                </motion.button>
              </div>
          
              <div className="grid gap-4">
                {memberNetBalances.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-300 ${
                      member.netAmount > 0
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300'
                        : member.netAmount < 0
                        ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:border-red-300'
                        : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        member.netAmount > 0
                          ? 'bg-green-500'
                          : member.netAmount < 0
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                      }`}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                        <p className="text-sm text-gray-600">
                          {member.netAmount > 0 
                            ? 'Owes you money' 
                            : member.netAmount < 0 
                            ? 'You owe them' 
                            : 'All settled up'}
                        </p>
                      </div>
                    </div>
                
                    <div className="text-right">
                      {member.netAmount > 0 ? (
                        <div className="text-2xl font-black text-green-600">+₹{member.netAmount}</div>
                      ) : member.netAmount < 0 ? (
                        <div className="text-2xl font-black text-red-600">-₹{Math.abs(member.netAmount)}</div>
                      ) : (
                        <div className="text-xl font-bold text-gray-500">₹0</div>
                      )}
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        {member.netAmount !== 0 ? 'Balance' : 'Settled'}
                      </div>
                    </div>
                  </motion.div>
                ))}
            
                {memberNetBalances.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-gray-500"
                  >
                    <FaUserFriends className="text-6xl mx-auto mb-4 text-gray-300" />
                    <p className="text-xl font-semibold mb-2">No members yet</p>
                    <p>Add some friends to start splitting expenses!</p>
                  </motion.div>
                )}
              </div>
          </div>
        </motion.div>

        <AddMember
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        currentUserId={currentUserId}
        currentGroupId={groupId ? parseInt(groupId) : 0}
        groupMembers={members}
      />

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddExpense}
        onRequestClose={() => setShowAddExpense(false)}
        ariaHideApp={false}
        className="bg-transparent p-0 max-w-2xl w-full mx-auto mt-10 sm:mt-20 outline-none border-none shadow-none"
        overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="bg-white rounded-2xl p-6 sm:p-12 shadow-2xl border border-teal-300 w-full mx-4 sm:mx-0"
        >
          <h2 className="text-3xl font-bold mb-8 text-teal-700">
            Add New Expense
          </h2>
          <form onSubmit={handleExpenseSubmit} className="space-y-6">
            <div className="modern-input-group">
              <input
                type="text"
                required
                value={expenseForm.description}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                className="modern-input"
                placeholder=" "
              />
              <label className="modern-label">Description</label>
            </div>

            <div className="modern-input-group">
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                className="modern-input"
                placeholder=" "
              />
              <label className="modern-label">Amount (₹)</label>
            </div>

            <div className="modern-input-group">
              <select
                value={expenseForm.paidByUserId}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, paidByUserId: parseInt(e.target.value) }))}
                className="modern-input"
              >
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <label className="modern-label">Paid By</label>
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-semibold text-teal-700 mb-3">
                Split With Members
              </label>
              
              {/* Select All Option */}
              <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={expenseForm.selectAll}
                  onChange={(e) => handleSelectAllToggle(e.target.checked)}
                  className="w-5 h-5 text-teal-600 bg-white border-2 border-teal-300 rounded focus:ring-teal-500 focus:ring-2"
                />
                <label htmlFor="selectAll" className="text-teal-800 font-semibold cursor-pointer">
                  Select All Members (Split Evenly)
                </label>
              </div>

              {/* Individual Member Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                {members.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
                    <input
                      type="checkbox"
                      id={`member-${member.id}`}
                      checked={expenseForm.selectedMembers.includes(member.id)}
                      onChange={(e) => handleMemberSelection(member.id, e.target.checked)}
                      className="w-4 h-4 text-teal-600 bg-white border-2 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                    />
                    <label htmlFor={`member-${member.id}`} className="text-gray-700 cursor-pointer flex-1">
                      {member.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-end flex-col sm:flex-row">
              <motion.button
                type="button"
                onClick={() => setShowAddExpense(false)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl border-2 border-gray-300 hover:border-gray-400"
                disabled={submittingExpense}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="modern-btn"
                disabled={submittingExpense}
              >
                {submittingExpense ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    ✨ Add Expense
                  </span>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </Modal>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="backdrop-blur-sm"
      />
    </div>
  );
};

export default GroupDashboard;
