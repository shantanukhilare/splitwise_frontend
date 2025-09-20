import { motion } from "framer-motion";
import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { addFriend } from "../services/FriendService";

interface AddFriendProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: number;
}

interface FriendData {
  name: string;
  emailOrPhone: string;
}

const AddFriend: React.FC<AddFriendProps> = ({
  isOpen,
  onClose,
  currentUserId,
}) => {
  const [friendData, setFriendData] = useState<FriendData>({
    name: "",
    emailOrPhone: "",
  });
  const [errors, setErrors] = useState<Partial<FriendData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<FriendData> = {};
    
    if (!friendData.name.trim()) {
      newErrors.name = "Name, email, or phone number is required";
    } else if (friendData.name.trim().length < 2) {
      newErrors.name = "Entry must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FriendData, value: string) => {
    setFriendData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Clear submit error
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSubmit = async () => {
    // Validation is commented out as in your original code
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await addFriend({
        userId: currentUserId,
        name: friendData.name.trim()
      });

      console.log('Successfully added friend:', response);

      // Show success toast with API response
      toast.success(response || "Friend added successfully!");

      // Reset form and close modal
      setFriendData({ name: "", emailOrPhone: "" });
      setErrors({});
      onClose();
      
    } catch (err) {
      console.error('Error adding friend:', err);
      toast.error('Failed to add friend. Please try again.');
      setSubmitError('Failed to add friend. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFriendData({ name: "", emailOrPhone: "" });
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      ariaHideApp={false}
      className="bg-white rounded-lg p-6 max-w-md w-full mx-auto mt-20 outline-none"
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
          <h2 className="text-xl font-semibold text-gray-800">Add Friend</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Submit Error */}
        {submitError && (
          <div className="mb-4 p-3 text-red-700 bg-red-50 rounded-lg border border-red-200">
            {submitError}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name or email or phone*
            </label>
            <input
              type="text"
              value={friendData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter friend's name"
              className={`w-full px-4 py-3 border-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !friendData.name.trim()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
          >
            {isSubmitting ? (
              <>
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding Friend...
              </>
            ) : (
              'Add Friend'
            )}
          </button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default AddFriend;