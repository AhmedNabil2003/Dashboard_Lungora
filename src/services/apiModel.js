import axiosInstance from '../services/axiosInstance';  // استيراد axiosInstance

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    console.log("Making API call...");
    const response = await axiosInstance.post(
      '/ModelAI/AI_Model',  // استخدام axiosInstance مع المسار النسبي
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',  // نوع البيانات عند رفع صورة
        }
      }
    );
    console.log("API response:", response);
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export { uploadImage };
