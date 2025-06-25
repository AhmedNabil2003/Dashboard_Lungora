import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Rocket } from 'lucide-react';
import { ThemeContext } from '../context/ThemeProviderContext'; 

const PageNotFound = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800'
    }`}>
      {/* Main Content */}
      <div className="max-w-md mx-auto">
        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-[120px] font-bold ${
              theme === 'dark' ? 'text-gray-700' : 'text-gray-200'
            }`}>404</span>
          </div>
          <div className="relative z-10 flex justify-center">
            <div className={`p-6 rounded-full shadow-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`w-32 h-32 rounded-full flex items-center justify-center animate-bounce ${
                theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                <Rocket className={`w-16 h-16 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Page Not Found
        </h1>
        <p className={`text-lg mb-8 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-blue-700 hover:bg-blue-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                : 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-200'
            }`}
          >
            <Home className="w-5 h-5" />
            Home Page
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={`fixed top-1/4 left-10 w-8 h-8 rounded-full animate-[float_6s_ease-in-out_infinite] ${
        theme === 'dark' ? 'bg-blue-900 opacity-30' : 'bg-blue-200 opacity-30'
      }`}></div>
      <div className={`fixed top-1/3 right-20 w-6 h-6 rounded-full animate-[float_6s_ease-in-out_2s_infinite] ${
        theme === 'dark' ? 'bg-blue-800 opacity-40' : 'bg-blue-300 opacity-40'
      }`}></div>
      <div className={`fixed bottom-1/4 left-1/4 w-4 h-4 rounded-full animate-[float_6s_ease-in-out_4s_infinite] ${
        theme === 'dark' ? 'bg-blue-700 opacity-50' : 'bg-blue-400 opacity-50'
      }`}></div>
    </div>
  );
};

export default PageNotFound;