import React, { useState, useRef } from 'react';
import LungoraImage from "../assets/images.jpg";
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { uploadImage } from '../services/apiModel';  

const LungoraModel = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleSubmit = async () => {
    if (file) {
      setLoading(true);
      try {
        const response = await uploadImage(file);
        
        if (response && response.isSuccess) {
          if (response.result.message === "Image Again") {
            setResult("The image is unclear. Please upload a clearer image.");
          } else {
            setResult(response.result.predicted || "Analysis completed successfully.");
          }
        } else {
          setResult("Error: Unable to process the image. Please try again.");
        }
        setShowResult(true);
      } catch (error) {
        setResult("Error processing the image. Please try again.");
        console.error("Error during image processing:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setShowResult(false);
    setResult("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  const handleDownload = () => {
    if (result) {
      const element = document.createElement("a");
      const file = new Blob([result], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "ai-analysis-result.txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Main Container */}
      <div className="w-full flex flex-col">
        {/* Content Container */}
        <div className="flex flex-col items-center p-4 h-full">
          {/* Main White Box Container */}
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Header Section with Title and Logo */}
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              <div className="flex items-center mb-3 sm:mb-0">
                <motion.img
                  src={LungoraImage}
                  alt="Lungora Logo"
                  className="w-12 h-12 rounded-full shadow-md"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
                />
                <div className="ml-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-sky-700">AI Lungora Model</h1>
                  <p className="text-sm text-sky-500">Advanced X-Ray Analysis System</p>
                </div>
              </div>
              
              <motion.div 
                className="flex items-center gap-1 bg-sky-50 py-1 px-2 rounded-full text-sky-600 text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
              >
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                AI Powered Analysis
              </motion.div>
            </div>
            
            {/* Divider */}
            <div className="border-b border-gray-100 mb-4"></div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              {/* Upload Section */}
              <motion.div
                className="bg-gray-50 p-5 rounded-xl shadow-sm w-full md:w-1/2"
                whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-sky-700">Upload X-Ray</h2>
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-sky-500 rounded-full mr-1"></span>
                    <span className="text-xs text-sky-500">Step 1</span>
                  </div>
                </div>

                {/* Box for image upload */}
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mb-4">
                  {!preview && (
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="border-2 border-dashed border-sky-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-50 transition-colors duration-300"
                    >
                      <motion.div
                        className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mb-3"
                        whileHover={{ scale: 1.1, rotate: 15 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </motion.div>
                      <p className="text-sky-600 font-medium text-base">Choose X-ray Image</p>
                      <p className="text-gray-500 text-xs mt-1">PNG, JPG, JPEG</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </div>
                  )}

                  {preview && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sky-600 text-sm font-medium">Image Uploaded:</p>
                        <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">Ready</span>
                      </div>
                      <div className="relative rounded-lg overflow-hidden bg-gray-50 h-44">
                        <img
                          src={preview}
                          alt="X-ray Preview"
                          className="object-contain w-full h-full"
                        />
                      </div> 
                    </motion.div>
                  )}
                </div>

                {preview && (
                  <div className="flex justify-center gap-3 mt-4">
                    <motion.button
                      className={`flex items-center px-4 py-2 rounded-lg text-white ${file ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-400 cursor-not-allowed'}`}
                      whileHover={file ? { scale: 1.05 } : {}}
                      disabled={!file}
                      onClick={handleSubmit}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      Submit for Analysis
                    </motion.button>

                    <motion.button
                      className="flex items-center px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                      whileHover={{ scale: 1.05 }}
                      onClick={handleReset}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reset
                    </motion.button>
                  </div>
                )}
              </motion.div>

              {/* Result Box */}
              <motion.div
                className="bg-gray-50 p-5 rounded-xl shadow-sm w-full md:w-1/2"
                whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-sky-700">Analysis Result</h2>
                  <div className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-sky-500 rounded-full mr-1"></span>
                    <span className="text-xs text-sky-500">Step 2</span>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm h-44 flex flex-col justify-center">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-sky-600">Processing your image...</p>
                      <p className="text-xs text-gray-500 mt-2">This may take a few moments</p>
                    </div>
                  ) : showResult ? (
                    <div className="h-full flex flex-col justify-between">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3 flex-grow overflow-auto">
                        <p className="text-gray-700">{result}</p>
                      </div>
                      <motion.button
                        className="flex items-center justify-center px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 w-full"
                        whileHover={{ scale: 1.02 }}
                        onClick={handleDownload}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg> 
                        Download Result
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <motion.div
                        className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-3"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </motion.div>
                      <p className="text-sky-600 font-medium">Waiting for analysis</p>
                      <p className="text-gray-500 text-xs mt-1">Upload an X-ray image first</p>
                    </div> 
                  )}
                </div>
                
                <div className="mt-4 p-2 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center text-xs text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    AI analysis results are for reference only. Always consult with a healthcare professional.
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
              AI Lungora Model © 2025 | Advanced X-Ray Analysis System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LungoraModel;