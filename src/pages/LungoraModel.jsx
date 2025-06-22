import React, { useState, useRef, useContext } from 'react';
import LungoraImage from "../assets/images.jpg";
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { uploadImage } from '../services/apiModel';
import { ThemeContext } from '../context/ThemeContext';

const LungoraModel = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState('');
  const [showingResult, setShowingResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { theme } = useContext(ThemeContext);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setUploading(false);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const handleSubmit = async () => {
    if (file) {
      setLoading(true);
      try {
        const response = await uploadImage(file);
        if (response && response.isSuccess) {
          // تحويل النتيجة إلى أحرف كبيرة
          const formattedResult = response.result.predicted 
            ? response.result.predicted.toUpperCase() 
            : response.result.message.toUpperCase();
          setResult(formattedResult);
        } else {
          setResult('ERROR: UNABLE TO PROCESS THE IMAGE. PLEASE TRY AGAIN.');
        }
        setShowingResult(true);
      } catch (error) {
        setResult('ERROR: UNABLE TO PROCESS THE IMAGE. PLEASE TRY AGAIN.');
        console.error('Error during image processing:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setShowingResult(false);
    setResult('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = () => {
    if (result) {
      const element = document.createElement('a');
      const file = new Blob([result], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'ai-analysis-result.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className={`flex ${theme === "light" ? "bg-gray-50" : "bg-gray-900"} min-h-[90vh] w-full`}>
      <div className="w-full flex flex-col">
        <div className="flex flex-col items-center p-3 sm:p-4 min-h-[90vh]">
          <div className={`w-full max-w-7xl ${theme === "light" ? "bg-white" : "bg-gray-800"} rounded-2xl shadow-2xl p-4 sm:p-8 mb-4 flex flex-col flex-grow`}>
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
                  <h1 className={`text-2xl sm:text-3xl font-bold ${theme === "light" ? "text-sky-700" : "text-sky-300"}`}>AI Lungora Model</h1>
                  <p className={`text-xs sm:text-sm ${theme === "light" ? "text-sky-500" : "text-sky-400"}`}>Advanced X-Ray Analysis System</p>
                </div>
              </div>
              <motion.div
                className={`flex items-center gap-1 ${theme === "light" ? "bg-sky-50 text-sky-600" : "bg-sky-900 text-sky-300"} py-1 px-2 rounded-full text-xs`}
                whileHover={{ scale: 1.05 }}
              >
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                AI Powered Analysis
              </motion.div>
            </div>
            <div className={`border-b ${theme === "light" ? "border-gray-100" : "border-gray-700"} mb-4`}></div>

            <div className="flex flex-col lg:flex-row gap-4 justify-center flex-grow">
              {/* Upload Section */}
              <motion.div
                className={`${theme === "light" ? "bg-gray-50" : "bg-gray-700"} p-3 rounded-xl shadow-sm w-full lg:w-1/2`}
                whileHover={{ boxShadow: "0 6px 15px -5px rgba(0, 0, 0, 0.1), 0 6px 6px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className={`text-lg font-bold ${theme === "light" ? "text-sky-700" : "text-sky-300"}`}>Upload X-Ray</h2>
                  <div className="flex items-center">
                    <span className="inline-block w-1.5 h-1.5 bg-sky-500 rounded-full mr-1"></span>
                    <span className={`text-xs ${theme === "light" ? "text-sky-500" : "text-sky-400"}`}>Step 1</span>
                  </div>
                </div>

                <div className={`${theme === "light" ? "bg-white" : "bg-gray-800"} p-2.5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 mb-2 aspect-square max-w-[60%] mx-auto`}>
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="relative w-12 h-12 mb-3">
                        <div className="absolute inset-0 rounded-full border-2 border-sky-200 border-t-sky-600 animate-spin"></div>
                        <div className="absolute inset-1 rounded-full border-2 border-sky-100 border-t-sky-500 animate-spin animation-delay-200"></div>
                      </div>
                      <p className={`${theme === "light" ? "text-sky-600" : "text-sky-300"} text-sm`}>Uploading Image...</p>
                    </div>
                  ) : !preview ? (
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className={`border-2 border-dashed ${theme === "light" ? "border-sky-300 hover:bg-sky-50" : "border-sky-500 hover:bg-gray-500"} rounded-lg p-2.5 flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 h-full`}
                    >
                      <motion.div
                        className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center mb-1.5"
                        whileHover={{ scale: 1.1, rotate: 15 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </motion.div>
                      <p className={`${theme === "light" ? "text-sky-600" : "text-sky-300"} font-medium text-sm`}>Choose X-ray Image</p>
                      <p className={`${theme === "light" ? "text-gray-500" : "text-gray-300"} text-xs mt-0.5`}>PNG, JPG, JPEG</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className={`${theme === "light" ? "text-sky-600" : "text-sky-300"} text-sm font-medium`}>Uploaded:</p>
                        <span className={`${theme === "light" ? "bg-green-100 text-green-600" : "bg-green-900 text-green-300"} text-sm px-1 py-0.5 rounded-full`}>Ready</span>
                      </div>
                      <div className={`relative rounded-lg overflow-hidden ${theme === "light" ? "bg-gray-50" : "bg-gray-500"} h-full`}>
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
                  <div className="flex justify-center gap-2 mt-2">
                    <motion.button
                      className={`flex items-center justify-center px-2 py-1 rounded-lg text-white font-medium text-sm ${
                        file ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                      whileHover={file ? { scale: 1.05 } : {}}
                      disabled={!file || loading}
                      onClick={handleSubmit}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          Submit for Analysis
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      className="flex items-center justify-center px-2 py-1 rounded-lg bg-red-500 text-white font-medium text-sm hover:bg-red-600"
                      whileHover={{ scale: 1.05 }}
                      onClick={handleReset}
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reset
                    </motion.button>
                  </div>
                )}
              </motion.div>

              {/* Result Section */}
              <motion.div
                className={`${theme === "light" ? "bg-gray-50" : "bg-gray-700"} p-3 rounded-xl shadow-sm w-full lg:w-1/2`}
                whileHover={{ boxShadow: "0 6px 15px -5px rgba(0, 0, 0, 0.1), 0 6px 6px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className={`text-lg font-bold ${theme === "light" ? "text-sky-700" : "text-sky-300"}`}>Analysis Result</h2>
                  <div className="flex items-center">
                    <span className="inline-block w-1.5 h-1.5 bg-sky-500 rounded-full mr-1"></span>
                    <span className={`text-xs ${theme === "light" ? "text-sky-500" : "text-sky-400"}`}>Step 2</span>
                  </div>
                </div>

                <div className={`${theme === "light" ? "bg-white" : "bg-gray-600"} p-2.5 rounded-lg shadow-sm aspect-square max-w-[60%] mx-auto flex flex-col justify-center`}>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="relative w-16 h-16 mb-3">
                        <div className="absolute inset-0 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin"></div>
                        <div className="absolute inset-2 rounded-full border-4 border-sky-100 border-t-sky-500 animate-spin animation-delay-200"></div>
                        <div className="absolute inset-4 rounded-full border-4 border-sky-50 border-t-sky-400 animate-spin animation-delay-400"></div>
                      </div>
                      <p className={`${theme === "light" ? "text-sky-600" : "text-sky-300"} text-sm font-medium`}>Analyzing your X-ray...</p>
                      <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-300"} mt-1`}>This may take a few moments</p>
                      <div className="w-3/4 h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-sky-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                        />
                      </div>
                    </div>
                  ) : showingResult ? (
                    <div className="h-full flex flex-col">
                      <div className={`${theme === "light" ? "bg-gray-50 border-gray-100" : "bg-gray-700 border-gray-600"} p-1.5 rounded-lg border mb-1.5 flex-grow flex items-center justify-center overflow-auto`}>
                        <p className={`${theme === "light" ? "text-gray-700" : "text-gray-100"} text-xl font-bold text-center`}>
                          {result === 'NORMAL' ? (
                            <span className="text-green-600">{result}</span>
                          ) : result === 'PNEUMONIA' ? (
                            <span className="text-yellow-600">{result}</span>
                          ) : result === 'COVID' ? (
                            <span className="text-red-600">{result}</span>
                          ) : (
                            result
                          )}
                        </p>
                      </div>
                      <motion.button
                        className="flex items-center justify-center px-2 py-1 rounded-lg bg-sky-500 text-white font-medium text-sm hover:bg-sky-600 w-full"
                        whileHover={{ scale: 1.02 }}
                        onClick={handleDownload}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download Result
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <motion.div
                        className={`w-8 h-8 ${theme === "light" ? "bg-sky-100" : "bg-sky-900"} rounded-full flex items-center justify-center mb-1.5`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${theme === "light" ? "text-sky-400" : "text-sky-500"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </motion.div>
                      <p className={`${theme === "light" ? "text-sky-600" : "text-sky-300"} font-medium text-sm`}>Waiting for analysis</p>
                      <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-300"} mt-0.5`}>Upload an X-ray image first</p>
                    </div>
                  )}
                </div>

                <div className={`mt-3 p-1.5 ${theme === "light" ? "bg-white border-gray-100" : "bg-gray-700 border-gray-600"} rounded-lg border`}>
                  <div className={`flex items-center text-xs ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-sky-500 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    AI analysis results are for reference only. Always consult with a healthcare professional.
                  </div>
                </div>
              </motion.div>
            </div>

            <div className={`mt-6 pt-3 border-t ${theme === "light" ? "border-gray-100" : "border-gray-700"} text-center text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
              AI Lungora Model © 2025 | Advanced X-Ray Analysis System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LungoraModel;