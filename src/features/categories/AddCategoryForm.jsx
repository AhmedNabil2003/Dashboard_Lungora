import { useState } from "react";

export default function AddCategoryForm({ defaultValue = "", onSubmit, onCancel }) {
  const [name, setName] = useState(defaultValue);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("اسم الفئة مطلوب");
      return;
    }
    
    onSubmit(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="categoryName" className="block text-gray-700 mb-2">
          اسم الفئة
        </label>
        <input
          type="text"
          id="categoryName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="أدخل اسم الفئة"
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
        >
          حفظ
        </button>
      </div>
    </form>
  );
}