import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/authContext";

const PublicRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PublicRoute;
