import { useState, useEffect, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { User, Mail, Shield, Camera, X } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

const UserForm = ({ isOpen, onClose, onSave, title, user, isSubmitting = false }) => {
  const { theme } = useContext(ThemeContext);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user?.imageUser) {
      if (user.imageUser instanceof File) {
        setImagePreview(URL.createObjectURL(user.imageUser));
      } else if (typeof user.imageUser === "string") {
        setImagePreview(user.imageUser);
      }
    } else {
      setImagePreview(null);
    }
    setSelectedFile(null);
  }, [user]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (!isOpen) return null;

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
      .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    status: Yup.string()
      .required("Status is required"),
    roles: Yup.array()
      .min(1, "At least one role is required")
      .required("Roles are required"),
  });

  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    status: user?.status || "Active",
    roles: user?.roles || ["User"],
    imageUser: user?.imageUser || null,
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file (JPG, PNG, GIF)");
        event.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image size should be less than 5MB");
        event.target.value = "";
        return;
      }

      setSelectedFile(file);
      setFieldValue("imageUser", file);
      setErrorMessage(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (imagePreview && imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setSubmitting(true);
      setErrorMessage(null);

      const formData = {
        ...values,
        imageUser: selectedFile || values.imageUser,
      };

      await onSave(formData);
      setImagePreview(null);
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      setErrorMessage("Failed to save user. Please try again.");
      if (error.message?.includes("email")) {
        setFieldError("email", error.message);
      } else if (error.message?.includes("name")) {
        setFieldError("name", error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = (role, isChecked, values, setFieldValue) => {
    const newRoles = isChecked
      ? [...values.roles, role]
      : values.roles.filter((r) => r !== role);
    setFieldValue("roles", newRoles);
  };

  const handleClose = () => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setSelectedFile(null);
    setErrorMessage(null);
    onClose();
  };

  const availableRoles = ["Admin", "User"];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div
        className={`p-3 rounded-lg shadow-xl w-full max-w-[320px] md:max-w-[500px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h2
            className={`text-sm font-bold ${
              theme === "light" ? "text-sky-600" : "text-sky-300"
            } border-b pb-1`}
          >
            {title}
          </h2>
          <button
            onClick={handleClose}
            className={`${
              theme === "light" ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"
            } cursor-pointer text-sm`}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, errors, touched, isSubmitting: formIsSubmitting }) => (
            <Form className="space-y-1.5">
              {/* Profile Image Section */}
              <div
                className={`p-2 rounded-md border ${
                  theme === "light" ? "bg-sky-50 border-sky-100" : "bg-sky-900 border-sky-800"
                }`}
              >
                <div className="flex items-center mb-1">
                  <Camera
                    className={`h-2.5 w-2.5 ${
                      theme === "light" ? "text-sky-500" : "text-sky-300"
                    } mr-1`}
                  />
                  <h3
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-sky-700" : "text-sky-200"
                    }`}
                  >
                    Profile Image
                  </h3>
                </div>
                <p
                  className={`text-xs ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  } mb-1.5`}
                >
                  Upload a profile image (Max size: 5MB, Formats: JPG, PNG, GIF).
                </p>
                <div className="flex flex-col items-start space-y-1">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="h-8 w-8 object-cover rounded-full border border-sky-500"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center border border-sky-500">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="file"
                      id="imageUser"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      className="hidden"
                      disabled={isSubmitting || formIsSubmitting}
                    />
                    <label
                      htmlFor="imageUser"
                      className={`inline-block px-2 py-1 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                        theme === "light"
                          ? "bg-sky-100 text-sky-700 hover:bg-sky-200 border border-gray-300"
                          : "bg-sky-900 text-sky-300 hover:bg-sky-800 border border-gray-600"
                      } ${isSubmitting || formIsSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {imagePreview ? "Edit Image" : "Upload Image"}
                    </label>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div
                className={`p-2 rounded-md border ${
                  theme === "light" ? "bg-sky-50 border-sky-100" : "bg-sky-900 border-sky-800"
                }`}
              >
                <div className="flex items-center mb-1">
                  <User
                    className={`h-2.5 w-2.5 ${
                      theme === "light" ? "text-sky-500" : "text-sky-300"
                    } mr-1`}
                  />
                  <h3
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-sky-700" : "text-sky-200"
                    }`}
                  >
                    Personal Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <div className="space-y-0.5">
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <User
                        className={`absolute left-1 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 ${
                          theme === "light" ? "text-sky-500" : "text-sky-300"
                        }`}
                      />
                      <Field
                        name="name"
                        type="text"
                        placeholder="Enter full name"
                        className={`w-full pl-5 pr-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                          errors.name && touched.name
                            ? "border-red-500"
                            : theme === "light"
                            ? "border-gray-300"
                            : "border-gray-600"
                        } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                        disabled={isSubmitting || formIsSubmitting}
                      />
                    </div>
                    <ErrorMessage name="name" component="p" className="text-red-500 text-xs" />
                  </div>

                  <div className="space-y-0.5">
                    <label
                      htmlFor="email"
                      className={`block text-sm font-medium ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-1 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 ${
                          theme === "light" ? "text-sky-500" : "text-sky-300"
                        }`}
                      />
                      <Field
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        className={`w-full pl-5 pr-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 ${
                          errors.email && touched.email
                            ? "border-red-500"
                            : theme === "light"
                            ? "border-gray-300"
                            : "border-gray-600"
                        } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
                        disabled={isSubmitting || formIsSubmitting}
                      />
                    </div>
                    <ErrorMessage name="email" component="p" className="text-red-500 text-xs" />
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div
                className={`p-2 rounded-md border ${
                  theme === "light" ? "bg-sky-50 border-sky-100" : "bg-sky-900 border-sky-800"
                }`}
              >
                <div className="flex items-center mb-1">
                  <Shield
                    className={`h-2.5 w-2.5 ${
                      theme === "light" ? "text-sky-500" : "text-sky-300"
                    } mr-1`}
                  />
                  <h3
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-sky-700" : "text-sky-200"
                    }`}
                  >
                    Account Status
                  </h3>
                </div>
                <div className="space-y-0.5">
                  <label
                    htmlFor="status"
                    className={`block text-sm font-medium ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Status *
                  </label>
                  <Field
                    as="select"
                    name="status"
                    className={`w-full px-1 py-0.5 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer transition-colors appearance-none ${
                      errors.status && touched.status
                        ? "border-red-500"
                        : theme === "light"
                        ? "border-gray-300 bg-white"
                        : "border-gray-600 bg-gray-800 text-gray-200"
                    }`}
                    disabled={isSubmitting || formIsSubmitting}
                  >
                    <option value="Active">🟢 Active</option>
                    <option value="Not Active">🔴 Not Active</option>
                  </Field>
                  <ErrorMessage name="status" component="p" className="text-red-500 text-xs" />
                </div>
              </div>

              {/* Roles Section */}
              <div
                className={`p-2 rounded-md border ${
                  theme === "light" ? "bg-sky-50 border-sky-100" : "bg-sky-900 border-sky-800"
                }`}
              >
                <div className="flex items-center mb-1">
                  <Shield
                    className={`h-2.5 w-2.5 ${
                      theme === "light" ? "text-sky-500" : "text-sky-300"
                    } mr-1`}
                  />
                  <h3
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-sky-700" : "text-sky-200"
                    }`}
                  >
                    User Roles
                  </h3>
                </div>
                <p
                  className={`text-xs ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  } mb-1.5`}
                >
                  Select the roles for this user.
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {availableRoles.map((role) => (
                    <label
                      key={role}
                      className={`flex items-center p-1 border rounded-md cursor-pointer transition-colors text-sm ${
                        values.roles.includes(role)
                          ? theme === "light"
                            ? "bg-sky-100 border-sky-300 text-sky-700"
                            : "bg-sky-900 border-sky-800 text-sky-300"
                          : theme === "light"
                          ? "bg-white border-gray-200 hover:bg-gray-50"
                          : "bg-gray-800 border-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={values.roles.includes(role)}
                        onChange={(e) => handleRoleChange(role, e.target.checked, values, setFieldValue)}
                        className={`h-3 w-3 text-sky-600 rounded border-gray-300 focus:ring-sky-500 ${
                          isSubmitting || formIsSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isSubmitting || formIsSubmitting}
                      />
                      <span className="ml-1">{role}</span>
                    </label>
                  ))}
                </div>
                <ErrorMessage name="roles" component="p" className="text-red-500 text-xs mt-1" />
              </div>

              {errorMessage && (
                <div
                  className={`p-2 rounded border text-xs mb-2 ${
                    theme === "light" ? "bg-red-50 border-red-200 text-red-800" : "bg-red-900 border-red-800 text-red-200"
                  }`}
                >
                  {errorMessage}
                </div>
              )}

              {/* Form Actions */}
              <div
                className={`flex justify-end mt-2 pt-1 border-t ${
                  theme === "light" ? "border-gray-200" : "border-gray-600"
                }`}
              >
                <button
                  type="button"
                  onClick={handleClose}
                  className={`${
                    theme === "light" ? "bg-gray-400 hover:bg-gray-500" : "bg-gray-600 hover:bg-gray-700"
                  } text-white px-2 py-0.5 rounded-md mr-1 transition-colors text-sm cursor-pointer ${
                    isSubmitting || formIsSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting || formIsSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${
                    theme === "light" ? "bg-sky-600 hover:bg-sky-700" : "bg-sky-700 hover:bg-sky-800"
                  } text-white px-2 py-0.5 rounded-md transition-colors text-sm cursor-pointer flex items-center justify-center relative ${
                    isSubmitting || formIsSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting || formIsSubmitting}
                >
                  {(isSubmitting || formIsSubmitting) ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-4 w-4 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UserForm;