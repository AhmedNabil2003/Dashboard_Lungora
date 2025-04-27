import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

export default function AddCategoryForm({ defaultValue = "", onSubmit, onCancel }) {
  // Create validation schema
  const CategorySchema = Yup.object().shape({
    categoryName: Yup.string()
      .required("Category name is required")
      .min(3, "Category name must be at least 3 characters")
      .max(50, "Category name cannot exceed 50 characters")
  });

  const initialValues = {
    categoryName: defaultValue
  };

  useEffect(() => {
    // Update form values when defaultValue changes (for edit mode)
  }, [defaultValue]);

  const handleSubmitForm = (values, { resetForm }) => {
    onSubmit(values.categoryName);
    resetForm();
  };

  const handleCancel = () => {
    onCancel?.();
    toast("Cancelled", { icon: "❌" });
  };
  const isEditMode = defaultValue !== "";
  
  // Button text based on mode
  const getButtonText = () => {
    if (isEditMode) return "Update";
    return "Add";
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CategorySchema}
      onSubmit={handleSubmitForm}
      enableReinitialize={true} // Important for edit mode
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="space-y-4">
          <div className="form-control">
            <label htmlFor="categoryName" className="text-sm font-medium text-gray-700 mb-1 block">
              Category Name
            </label>
            <Field
              type="text"
              id="categoryName"
              name="categoryName"
              placeholder="Enter category name"
              className={`w-full p-2 border rounded-md transition duration-200 ${
                errors.categoryName && touched.categoryName
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-sky-500 focus:border-sky-500"
              }`}
            />
            <ErrorMessage
              name="categoryName"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center"
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