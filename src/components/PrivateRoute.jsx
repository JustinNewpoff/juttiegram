import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth";

export default function PrivateRoute() {
  const currentUser = useContext(AuthContext);
  let user = currentUser.currentUser;
  return (
    <div className="private">
      {user ? <Outlet /> : <Navigate to="/login" />}
    </div>
  );
}
