const Button = ({ children, onClick, disabled }) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mt-4 transition-all duration-300 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  