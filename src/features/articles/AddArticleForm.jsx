import { useState, useRef, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ThemeContext } from "../../context/ThemeContext";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function AddArticleForm({
  initialData = {},
  onSubmit,
  onClose,
  categoryId: categoryIdFromProps,
}) {
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(initialData?.coverImage || null);
  const fileInputRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const isEditMode = Boolean(initialData?.id);

  const initialValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    categoryId: initialData?.categoryId || categoryIdFromProps || 0,
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    content: Yup.string()
      .required("Content is required")
      .min(20, "Content must be at least 20 characters"),
    categoryId: Yup.number()
      .min(1, "Please select a category")
      .required("Category is required"),
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setCoverImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("content", values.content);
      formData.append("categoryId", values.categoryId);
      
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await onSubmit(formData, isEditMode ? initialData.id : null);

      if (!isEditMode) {
        resetForm();
        setCoverImage(null);
        setCoverImagePreview(null);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} article:`, error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-3" encType="multipart/form-data">
          <div className="mb-4">
            <label
              className={`block font-medium mb-1 text-sm ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
            >
              Cover Image
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              id="coverImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            
            {coverImagePreview ? (
              <div className="space-y-1">
                <div
                  className={`border rounded-lg overflow-hidden flex justify-center items-center h-32 ${
                    theme === "light" ? "bg-gray-50" : "bg-gray-700"
                  }`}
                >
                  <img
                    src={coverImagePreview}
                    alt="Article cover"
                    className="h-full w-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-1 text-xs ${
                    theme === "light"
                      ? "text-blue-600 hover:bg-blue-50"
                      : "text-blue-400 hover:bg-blue-600"
                  } font-medium px-2 py-1 cursor-pointer rounded transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Change Image
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`${
                  theme === "light"
                    ? "border-2 border-dashed border-gray-300"
                    : "border-2 border-dashed border-gray-600"
                } rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors`}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${theme === "light" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span
                    className={`${
                      theme === "light" ? "text-gray-700" : "text-white"
                    } text-xs font-medium`}
                  >
                    Upload cover image
                  </span>
                  <span
                    className={`${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    } text-xs`}
                  >
                    PNG, JPG, GIF up to 10MB
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="title"
              className={`block font-medium mb-1 text-sm ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
            >
              Title
            </label>
            <Field
              type="text"
              id="title"
              name="title"
              className={`w-full p-2 border rounded-md focus:ring focus:ring-sky-200 focus:border-sky-500 outline-none text-sm ${
                theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-white"
              }`}
              placeholder="Enter article title"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="mt-1 text-red-500 text-xs"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className={`block font-medium mb-1 text-sm ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
            >
              Description
            </label>
            <Field
              type="text"
              id="description"
              name="description"
              className={`w-full p-2 border rounded-md focus:ring focus:ring-sky-200 focus:border-sky-500 outline-none text-sm ${
                theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-white"
              }`}
              placeholder="Enter a short description"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="mt-1 text-red-500 text-xs"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className={`block font-medium mb-1 text-sm ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
            >
              Content
            </label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={4}
              className={`w-full p-2 border rounded-md focus:ring focus:ring-sky-200 focus:border-sky-500 outline-none text-sm ${
                theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-white"
              }`}
              placeholder="Write your article content here"
            />
            <ErrorMessage
              name="content"
              component="div"
              className="mt-1 text-red-500 text-xs"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className={`${
                  theme === "light"
                    ? "bg-gray-300 hover:bg-gray-400 text-gray-700"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                } px-3 py-1 rounded-md cursor-pointer transition-colors text-sm`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${
                  theme === "light"
                    ? "bg-sky-600 hover:bg-sky-700"
                    : "bg-sky-500 hover:bg-sky-400"
                } text-white px-3 py-1 rounded-md cursor-pointer transition-colors flex items-center gap-1 text-sm disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                        d="M4 12a8 8 0 0 0 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEditMode ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>{isEditMode ? "Update" : "Save"}</>
                )}
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}