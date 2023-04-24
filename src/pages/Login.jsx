import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function Login() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        getDoc(doc(db, "users", user.uid)).then((user) => {
          toast.success("login successful");
          navigate("/");
          setLoading(false);
          console.log(auth.currentUser);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Login failed");
        setLoading(false);
      });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="register-body">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="register-form">
            <form onSubmit={submit}>
              <h1>Login</h1>
              <hr />
              <input type="email" placeholder="email" id="" />
              <input type="password" placeholder="password" />
              <button type="submit">Login</button>
              <hr />
              <div className="register-form-bottom">
                <p>NEED AN ACCOUNT?</p>
                <Link to="/register">
                  <p>CLICK HERE TO REGISTER</p>
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
