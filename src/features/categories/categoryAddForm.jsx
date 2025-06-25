import { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { ThemeContext } from "../../context/themeContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function AddCategoryForm({ defaultValue = "", onSubmit, onCancel }) {
  const { theme } = useContext(ThemeContext);
  const isEditMode = defaultValue !== "";

  // Validation schema
  const CategorySchema = Yup.object().shape({
    categoryName: Yup.string()
      .required("Category name is required")
      .min(3, "Category name must be at least 3 characters")
      .max(50, "Category name cannot exceed 50 characters"),
  });

  const initialValues = {
    categoryName: defaultValue,
  };

  const handleSubmitForm = (values, { resetForm }) => {
    onSubmit(values.categoryName);
    resetForm();
  };

  const handleCancel = () => {
    onCancel?.();
    toast("Cancelled", { icon: "❌" });
  };

  const getButtonText = () => (isEditMode ? "Update" : "Add");

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CategorySchema}
      onSubmit={handleSubmitForm}
      enableReinitialize={true}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-3">
          {/* Category Name Field */}
          <div className="form-control">
            <label
              htmlFor="categoryName"
              className={`text-sm font-medium ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              } mb-1 block`}
            >
              Category Name
            </label>
            <Field
              type="text"
              id="categoryName"
              name="categoryName"
              placeholder="Enter category name"
              className={`w-full p-2 border rounded-md transition-colors text-sm ${
                errors.categoryName && touched.categoryName
                  ? theme === "light"
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-red-700 focus:ring-red-700 focus:border-red-700"
                  : theme === "light"
                    ? "border-gray-300 focus:ring-sky-500 focus:border-sky-500"
                    : "border-gray-600 focus:ring-sky-500 focus:border-sky-500"
              } ${
                theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-white"
              }`}
            />
            <ErrorMessage
              name="categoryName"
              component="div"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          {/* Buttons Section */}
          <div className="flex justify-end space-x-2 pt-2">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCancel}
              className={`${
                theme === "light"
                  ? "bg-gray-300 hover:bg-gray-400 text-gray-700"
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300"
              } px-3 py-1 cursor-pointer rounded-md transition-colors text-sm`}
            >
              Cancel
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                theme === "light"
                  ? "bg-sky-600 hover:bg-sky-700"
                  : "bg-sky-600 hover:bg-sky-500"
              } text-white px-3 py-1 cursor-pointer rounded-md transition-colors flex items-center text-sm disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Processing...
                </>
              ) : (
                getButtonText()
              )}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
