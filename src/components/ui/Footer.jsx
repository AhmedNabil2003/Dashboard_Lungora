import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`mt-8 text-center py-4 border-t ${
        theme === "light"
          ? "border-gray-200 text-gray-500"
          : "border-gray-700 text-gray-400"
      }`}
    >
      {/* Footer Section */}
      <p className="text-sm">
        <i className="fas fa-microscope text-sky-700 mr-2"></i>
        Lungora Medical System - Developed by Development Team
        <i className="fas fa-laptop-medical text-sky-700 ml-2"></i>
      </p>
      <p className="text-xs mt-1">
        Last Updated: {new Date().toLocaleDateString("en-US")} -{" "}
        {new Date().toLocaleTimeString("en-US")}
      </p>
    </div>
  );
};

export default Footer;
