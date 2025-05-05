import React, { useState, useEffect, useContext } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Edit2, Save, X, User } from "lucide-react";
import { getUserData, editUserInfo } from "../services/apiAuth";
import { ThemeContext } from "../context/ThemeContext";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
  });
  const [error, setError] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setUser(userData);
        setFormData({
          name: userData.fullName || "",
          avatar: userData.imageUser || "",
        });
      } catch (err) {
        setError("Failed to load user data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedData = {
      ...formData,
      avatar: avatarFile,
    };

    try {
      await editUserInfo(updatedData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setEditMode(false);
      }, 2000);
    } catch (err) {
      setError("Failed to update user data");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: user?.fullName || "",
      avatar: user?.imageUser || "",
    });
    setAvatarPreview(null);
    setAvatarFile(null);
    setEditMode(false);
  };

  const fileInputRef = React.createRef();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full"
        />
      </div>
    );

  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-100 text-red-700 rounded-lg max-w-md mx-auto mt-10 text-center"
      >
        {error}
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 lg:p-8 shadow-lg rounded-2xl max-w-4xl mx-auto my-8 relative overflow-hidden ${
        theme === "light" ? "bg-white" : "bg-gray-800"
      }`}
    >
      {/* Background Design Element */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-sky-400 to-sky-600 -z-10 rounded-t-2xl" />

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute top-4 right-4 left-4 p-3 rounded-lg text-center ${
              theme === "light"
                ? "bg-green-100 text-green-700"
                : "bg-green-800 text-green-200"
            }`}
          >
            Profile updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <h1
        className={`text-2xl lg:text-3xl font-bold mb-6 text-center ${
          theme === "light" ? "text-sky-700" : "text-white"
        }`}
      >
        User Profile
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-center md:items-start gap-8 mt-8">
        {/* Avatar Section */}
        <motion.div
          className="relative flex-shrink-0"
          whileHover={{ scale: editMode ? 1.05 : 1 }}
        >
          <div
            className={`w-36 h-36 md:w-48 md:h-48 rounded-full relative overflow-hidden 
        ${
          theme === "light"
            ? "bg-sky-100 border-sky-200"
            : "bg-gray-700 border-gray-600"
        } 
        border-4 shadow-md`}
          >
            {avatarPreview || formData.avatar ? (
              <img
                src={avatarPreview || formData.avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center 
          ${theme === "light" ? "bg-sky-50" : "bg-gray-800"}`}
              >
                <User
                  size={64}
                  className={`${
                    theme === "light" ? "text-sky-300" : "text-gray-400"
                  }`}
                />
              </div>
            )}
          </div>

          {editMode && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current.click()}
              className={`absolute bottom-2 right-2 p-3 cursor-pointer rounded-full text-white shadow-lg 
          ${theme === "light" ? "bg-sky-500" : "bg-gray-600"}`}
            >
              <Camera size={20} />
              <input
                ref={fileInputRef}
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </motion.button>
          )}
        </motion.div>

        {/* Form Section */}
        <div className="flex-grow w-full md:w-auto max-w-md">
          <AnimatePresence mode="wait">
            {editMode ? (
              <motion.form
                key="edit-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6 w-full"
              >
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    } mb-1`}
                    htmlFor="name"
                  >
                    Name:
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${
                      theme === "light" ? "border-sky-200" : "border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
                      theme === "light" ? "bg-white" : "bg-gray-800 text-white"
                    }`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="flex flex-wrap gap-3 justify-end mt-6">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={resetForm}
                    className={`flex items-center cursor-pointer gap-2 ${
                      theme === "light"
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    } px-5 py-2.5 rounded-lg transition-colors`}
                    disabled={isSubmitting}
                  >
                    <X size={18} />
                    <span>Cancel</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className={`flex items-center cursor-pointer gap-2 ${
                      theme === "light"
                        ? "bg-sky-500 hover:bg-sky-600 text-white"
                        : "bg-gray-600 hover:bg-gray-500 text-white"
                    } px-5 py-2.5 rounded-lg transition-colors ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="view-info"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div
                  className={`p-4 rounded-lg ${
                    theme === "light" ? "bg-sky-50" : "bg-gray-700"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      theme === "light" ? "text-gray-500" : "text-gray-300"
                    } mb-1`}
                  >
                    Name
                  </p>
                  <p
                    className={`text-lg font-medium ${
                      theme === "light" ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {formData.name || "No name specified"}
                  </p>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.03,
                    backgroundColor: theme === "light" ? "#0284c7" : "#374151",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setEditMode(true)}
                  className={`flex items-center cursor-pointer gap-2 ${
                    theme === "light"
                      ? "bg-sky-500 text-white hover:bg-sky-600"
                      : "bg-gray-700 text-white hover:bg-gray-600"
                  } px-6 py-3 rounded-lg mt-6 shadow-md hover:shadow-lg transition-all w-full md:w-auto justify-center`}
                >
                  <Edit2 size={18} />
                  <span>Edit Profile</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
