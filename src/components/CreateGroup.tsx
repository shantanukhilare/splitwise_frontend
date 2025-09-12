import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Modal from "react-modal";
import Select from "react-select";
import type { MultiValue } from "react-select";
import { createGroup, getGroupMembers, type CreateGroupPayload, type GroupMembersResponseBody } from "../services/groupService";
import { showSuccessToast } from "../utils/toastUtils"; // adjust path as needed

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
}

interface CreateGroupProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: number;
  onGroupCreated?: () => void;
}

interface Option {
  value: number;
  label: string;
}

const CreateGroup: React.FC<CreateGroupProps> = ({
  isOpen,
  onClose,
  currentUserId,
  onGroupCreated,
}) => {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    if (isOpen) {
      // Fetch users when modal opens
      const fetchUsers = async () => {
        try {
          getGroupMembers(currentUserId).then((data) => {
            // setUsers(data);
            const users=data
              .filter((item:GroupMembersResponseBody) => item && item.id && item.name) // Filter out invalid items
              .map((item:GroupMembersResponseBody)=>({
                id:item.id,
                name:item.name,
                email:"", // GroupMembersResponseBody doesn't have email
                phoneNumber:"" // GroupMembersResponseBody doesn't have phoneNumber
              }));
            setUsers(users.filter((u) => u.id !== currentUserId))
            const currentUser:User={
              id:currentUserId,
              name:localStorage.getItem("userName") || sessionStorage.getItem("userName") || "You",
              email:localStorage.getItem("email") || sessionStorage.getItem("email") || "",
              phoneNumber:localStorage.getItem("phoneNumber") || sessionStorage.getItem("phoneNumber") || ""
            }
            setUsers((prevUsers) => [currentUser, ...prevUsers]); // Add current user at the top  
            
            
          })
    }catch (err) {
          console.error("Failed to fetch users", err);
        }};
      fetchUsers();
    }
  }, [isOpen, currentUserId]);


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    const selectedUserIds = users
      .filter((u) => selectedUsers.some((su) => su.value === u.id))
      .map((u) => u.id);
    
    const payload:CreateGroupPayload = {
      name: groupName,
      createdBy: currentUserId,
      userIds: selectedUserIds,
    };
    
    await createGroup(payload);

    setGroupName("");
    setSelectedUsers([]);
    onClose();

    showSuccessToast("Group created successfully!");

    if (onGroupCreated) onGroupCreated();

  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to create group");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        ariaHideApp={false}
        className="bg-transparent p-0 max-w-2xl w-full mx-auto mt-10 sm:mt-20 outline-none border-none shadow-none"
        overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="background-image rounded-3xl p-6 sm:p-12 shadow-2xl border border-violet-300 w-full mx-4 sm:mx-0"
        >
          <h2 className="text-3xl font-bold mb-8 text-violet-700">
            Create New Group
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="groupName"
                className="block mb-2 font-semibold text-violet-700"
              >
                Group Name
              </label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border border-violet-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 text-violet-900"
                required
              />
            </div>
            <div>
              <label
                htmlFor="members"
                className="block mb-2 font-semibold text-violet-700"
              >
                Select Members
              </label>
              <Select
                isMulti
                options={users.map((u) => ({ value: u.id, label: u.name }))}
                value={selectedUsers}
                onChange={(selected: MultiValue<Option>) =>
                  setSelectedUsers(selected as Option[])
                }
                classNamePrefix="react-select"
                placeholder="Choose users..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: '#a78bfa', // violet-400
                    boxShadow: '0 0 0 2px #a78bfa33',
                    '&:hover': { borderColor: '#7c3aed' },
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#ede9fe', // violet-100
                    color: '#7c3aed',
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? '#a78bfa' : state.isFocused ? '#ede9fe' : undefined,
                    color: state.isSelected ? '#fff' : '#7c3aed',
                    cursor: 'pointer',
                  }),
                }}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-4 justify-end flex-col sm:flex-row">
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl border-2 border-gray-300 hover:border-gray-400"
                disabled={loading}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="modern-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Group
                  </span>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default CreateGroup;
