const Input = ({ type = "text", placeholder, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full border border-gray-300 p-2 rounded-md mt-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      {...props}
    />
  );
};

export default Input;
