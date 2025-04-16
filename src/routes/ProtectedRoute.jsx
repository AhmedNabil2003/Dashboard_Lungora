import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const {token} = useContext(AuthContext);
console.log(token);
  
  if(token){
    return children;
   } else {
    return <Navigate to="/" />;
    }
  
};

export default ProtectedRoute;
