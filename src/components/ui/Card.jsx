const Card = ({ children }) => {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">{children}</div>
    );
  };
  
  const CardContent = ({ children }) => {
    return <div className="p-4">{children}</div>;
  };
  
  export { Card, CardContent };
  