import { useState, useEffect } from "react";

export default function AddArticleForm({ initialData = null, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    coverImage: "",
    // أضف المزيد من الحقول حسب احتياجات API
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        content: initialData.content || "",
        coverImage: initialData.coverImage || "",
        // نسخ المزيد من البيانات إذا كانت موجودة
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // مسح الخطأ للحقل المعدّل
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "عنوان المقال مطلوب";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "وصف المقال مطلوب";
    }
    
    if (!formData.content.trim()) {
      newErrors.content = "محتوى المقال مطلوب";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData, initialData?.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-gray-700 mb-1">
          العنوان
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="أدخل عنوان المقال"
        />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-gray-700 mb-1">
          الوصف
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="2"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="أدخل وصفًا مختصرًا للمقال"
        ></textarea>
        {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
      </div>
      
      <div>
        <label htmlFor="content" className="block text-gray-700 mb-1">
          المحتوى
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="6"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="أدخل محتوى المقال"
        ></textarea>
        {errors.content && <p className="text-red-600 text-sm mt-1">{errors.content}</p>}
      </div>
      
      <div>
        <label htmlFor="coverImage" className="block text-gray-700 mb-1">
          رابط صورة الغلاف (اختياري)
        </label>
        <input
          type="text"
          id="coverImage"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="أدخل رابط صورة الغلاف"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
        >
          {initialData ? "تعديل" : "إضافة"}
        </button>
      </div>
    </form>
  );
}