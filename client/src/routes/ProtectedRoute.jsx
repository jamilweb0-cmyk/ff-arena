import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {

  const { user, loading } = useContext(AuthContext);

  const location = useLocation();

  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center">

        <span className="loading loading-spinner loading-lg"></span>

      </div>

    );

  }

  if (!user) {

    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );

  }

  return children;

};

export default ProtectedRoute;