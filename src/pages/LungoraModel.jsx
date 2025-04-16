import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import LungoraImage from "../assets/images.jpg";

const LungoraModel = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);  // إضافة مرجع لحقل الإدخال

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        if (uploadedFile) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(uploadedFile);
        }
    };

    const handleSubmit = () => {
        if (file) {
            setLoading(true);

            setTimeout(() => {
                const randomResult = Math.random() > 0.5
                    ? "The AI analysis indicates no abnormalities detected."
                    : "Potential lung abnormality detected. Further medical review recommended.";

                setResult(randomResult);
                setShowResult(true);
                setLoading(false);
            }, 3000);
        }
    };

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setShowResult(false);
        setResult("");
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // إعادة تعيين حقل الإدخال
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-300 to-white-200 p-4">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center w-full max-w-7xl justify-center">
                {/* Main Model Box */}
                <motion.div
                    className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl w-full sm:w-96 text-center mb-8 sm:mb-0"
                    initial={{ opacity: 0, scale: 0.9, y: 50 }} // بداية من الأسفل
                    animate={{ opacity: 1, scale: 1, y: 0 }} // تحرك للأعلى
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-sky-600 mb-6">AI Lungora Model</h1>

                    <motion.div
                        className="flex justify-center items-center mb-6"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.img
                            src={LungoraImage}
                            alt="Lungora"
                            className="w-16 sm:w-20 h-16 sm:h-20 rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, ease: 'linear' }}
                        />
                    </motion.div>

                    <p className="text-gray-700 mb-4 text-base sm:text-lg">Upload your X-ray image to analyze with the AI model.</p>

                    {/* Box for image upload */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg mb-4 cursor-pointer hover:bg-gray-200 transition-all duration-300">
                        {!preview && (
                            <label className="flex flex-col items-center text-sky-600">
                                <span className="text-sm mb-2">Choose an X-ray Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    ref={fileInputRef}
                                />
                                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-sky-600 text-white flex items-center justify-center rounded-full">
                                    <span className="text-2xl sm:text-3xl">+</span>
                                </div>
                            </label>
                        )}

                        {preview && (
                            <motion.div
                                className="mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-green-600 mb-4">Image Uploaded Successfully:</p>
                                <div className="relative w-full h-48 bg-gray-300 rounded-lg overflow-hidden">
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
                        <div className="flex justify-center gap-4 mt-6">
                            <motion.button
                                className={`px-6 py-3 rounded-lg text-white ${file ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                whileHover={file ? { scale: 1.1 } : {}}
                                disabled={!file}
                                onClick={handleSubmit}
                            >
                                Submit to AI Model
                            </motion.button>

                            <motion.button
                                className="px-6 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600"
                                whileHover={{ scale: 1.1 }}
                                onClick={handleReset}
                            >
                                Reset
                            </motion.button>
                        </div>
                    )}
                </motion.div>

                {/* Result Box */}
                <motion.div
                    className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl w-full sm:w-96 text-center"
                    initial={{ opacity: 0, scale: 0.9, y: 50 }} // بداية من الأسفل
                    animate={{ opacity: 1, scale: 1, y: 0 }} // تحرك للأعلى
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-semibold text-sky-600 mb-4">AI Analysis Result</h2>
                    {loading ? (
                        <div className="flex justify-center items-center">
                            <div className="w-8 h-8 border-t-4 border-sky-600 border-solid rounded-full animate-spin"></div>
                            <p className="ml-4 text-gray-700">Processing...</p>
                        </div>
                    ) : showResult ? (
                        <div>
                            <p className="text-gray-700 mb-4">{result}</p>
                            <motion.button
                                className="px-6 py-3 rounded-lg bg-sky-500 text-white hover:bg-sky-600"
                                whileHover={{ scale: 1.1 }}
                                onClick={handleDownload}
                            >
                                Download Result
                            </motion.button>
                        </div>
                    ) : (
                        <p className="text-gray-400 mb-4">Awaiting analysis result...</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default LungoraModel;
