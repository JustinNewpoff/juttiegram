import { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import Register from "../styles/Register.scss";

export default function Login() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const password2 = e.target[3].value;

    if (name !== "" && password === password2) {
      setLoading(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          setUser(user);
          updateProfile(auth.currentUser, {
            displayName: name,
          })
            .then(() => {
              setDoc(doc(db, "users", user.uid), {
                displayName: name,
                id: user.uid,
                email,
                profilePicURL: "",
                bio: "",
              });
            })
            .then(() => {
              navigate("/login");
              setLoading(false);
            });
        })
        .catch((error) => {
          toast.error("Something went wrong");
          navigate("/register");
        });
    } else {
      toast.error("Something went wrong");
      navigate("/register");
    }
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
              <h1>Register</h1>
              <hr />
              <input type="text" placeholder="username" />
              <input type="email" placeholder="email" />
              <input type="password" placeholder="password" />
              <input type="password" placeholder=" confirm password" />
              <button type="submit">Register</button>
              <hr />
              <div className="register-form-bottom">
                <p>ALREADY REGISTERED?</p>
                <Link to="/login">
                  <p>CLICK HERE TO LOGIN</p>
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
