import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import MobileNav from "./MobileNav";
import Navbar from "../styles/Navbar.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { AuthContext } from "../context/auth";
import { BsTypeH1 } from "react-icons/bs";

export default function Sidebar() {
  const navigate = useNavigate();
  const [act, setAct] = useState(false);
  const [menu, setMenu] = useState(false);
  let location = useLocation();
  const currentUser = useContext(AuthContext);
  let user = currentUser.currentUser;

  const links = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "New Post",
      path: "/new-post",
    },
    {
      title: "Shares",
      path: "/shared-post",
    },
    {
      title: "Profile",
      path: `/profile/${user.uid}`,
    },
    {
      title: "Logout",
      path: "/logout",
    },
  ];

  const bye = (link) => {
    if (link.path === "/logout") {
      signOut(auth)
        .then(() => {
          toast.success("Logged out");
          navigate("/login");
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  return (
    <>
      {menu ? (
        <MobileNav />
      ) : (
        <div className="navbar">
          <h1
            className="logo"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Juttiegram
          </h1>
          <div className="nav-links">
            {links.map((link, i) => {
              return (
                <div key={i} className="navbar-ul">
                  <Link
                    onClick={() => {
                      bye(link);
                    }}
                    to={link.path}
                    style={{
                      color: location.pathname == link.path && "#6acefc",
                      border:
                        location.pathname == link.path && "1px solid #6acefc",
                    }}
                  >
                    {link.title}
                  </Link>
                </div>
              );
            })}
          </div>
          <GiHamburgerMenu
            className="hamburger"
            onClick={() => setMenu(!menu)}
          />
        </div>
      )}
    </>
  );
}
