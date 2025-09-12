import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { friendsList, type GroupMembersResponseBody, addGroupMembers } from "../services/groupService";

interface AddMemberProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: number;
  currentGroupId: number;
  groupMembers?: GroupMembersResponseBody[];
}

interface User {
  userId: number; // ← Fixed: changed from id to userId
  name: string;
}

const AddMember: React.FC<AddMemberProps> = ({
  isOpen,
  onClose,
  currentUserId,
  currentGroupId,
  groupMembers,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [addingMembers, setAddingMembers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const data = await friendsList(currentUserId);
          
          // First, filter out current user and create unique users map
          const uniqueUsersMap = new Map();
          data.forEach(user => {
            if (user.userId !== currentUserId && !uniqueUsersMap.has(user.userId)) {
              uniqueUsersMap.set(user.userId, {
                userId: user.userId,
                name: user.name
              });
            }
          });
          
          let filteredUsers = Array.from(uniqueUsersMap.values());
          
          // Filter out users who are already group members
          if (groupMembers && groupMembers.length > 0) {
            const groupMemberIds = new Set(groupMembers.map(member => member.id));
            filteredUsers = filteredUsers.filter(user => !groupMemberIds.has(user.userId));
          }
          
          console.log('Final filtered users:', filteredUsers);
          setUsers(filteredUsers);
        } catch (err) {
          console.error('Error fetching users:', err);
          setError('Failed to fetch users');
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [isOpen, currentUserId, groupMembers]); // Added groupMembers to dependency array

  return (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    ariaHideApp={false}
    className="bg-white rounded-lg p-6 max-w-2xl w-full mx-auto mt-20 outline-none"
    overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Add Members</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-red-500 text-center py-6 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Users List */}
      {!loading && !error && (
        <div className="relative mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Users
          </label>
          
          {/* Dropdown Button */}
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-4 py-3 text-left bg-white border-2 border-gray-200 rounded-lg shadow-sm hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className={`${selectedUsers.length === 0 ? 'text-gray-400' : 'text-gray-700'}`}>
                {selectedUsers.length === 0 
                  ? "Choose users to add..." 
                  : `${selectedUsers.length} user${selectedUsers.length === 1 ? '' : 's'} selected`
                }
              </span>
              <svg 
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Selected Users Tags */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-lg">
              {selectedUsers.map(user => (
                <span 
                  key={user.userId} 
                  className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full border border-blue-200"
                >
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-2 text-xs font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUsers(selectedUsers.filter(u => u.userId !== user.userId));
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded-full p-1 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Dropdown Options */}
          {isDropdownOpen && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              {users.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No users available
                </div>
              ) : (
                users.map(user => {
                  const isSelected = selectedUsers.some(u => u.userId === user.userId);
                  return (
                    <div 
                      key={user.userId} 
                      className={`flex items-center p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedUsers(selectedUsers.filter(u => u.userId !== user.userId));
                        } else {
                          setSelectedUsers([...selectedUsers, user]);
                        }
                      }}
                    >
                      {/* User Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-medium ${
                        isSelected ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* User Name */}
                      <span className={`flex-1 select-none ${isSelected ? 'text-blue-800 font-medium' : 'text-gray-700'}`}>
                        {user.name}
                      </span>
                      
                      {/* Selected Indicator */}
                      {isSelected && (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium"
        >
          Cancel
        </button>
        {/* <button
          onClick={() => {
            // Add your member addition logic here
            console.log('Selected users:', selectedUsers);
            onClose();
          }}
          disabled={selectedUsers.length === 0}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
        >
          Add Members ({selectedUsers.length})
        </button> */}

        <button
          onClick={async () => {
            try {
              setAddingMembers(true);
              
              // Extract user IDs to send to the API
              const userIdsToAdd = selectedUsers.map(user => user.userId);
              
              // Call your API service to add members
              await addGroupMembers(userIdsToAdd,currentGroupId);
              
              console.log('Successfully added members:', selectedUsers);
              
              // Reset the form and close modal
              setSelectedUsers([]);
              setIsDropdownOpen(false);
              onClose();
              
              // Optional: Show success message or refresh parent component
              // You might want to call a callback here to refresh the group members list
              
            } catch (err) {
              console.error('Error adding members:', err);
              setError('Failed to add members to group');
            } finally {
              setAddingMembers(false);
            }
          }}
          disabled={selectedUsers.length === 0 || addingMembers}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
        >
          {addingMembers ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </>
          ) : (
            `Add Members (${selectedUsers.length})`
          )}
        </button>


      </div>
    </motion.div>
  </Modal>
);

};

export default AddMember;
