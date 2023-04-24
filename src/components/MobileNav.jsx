import { useState, useContext } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import Navbar from "../components/Navbar";
import mobileNav from "../styles/mobileNav.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { AuthContext } from "../context/auth";
import { BsTypeH1 } from "react-icons/bs";

export default function Sidebar() {
  const navigate = useNavigate();
  const [act, setAct] = useState(false);
  const [menu, setMenu] = useState(true);
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

  console.log(menu);

  return (
    <>
      {menu ? (
        <div className="mobile-nav">
          <div className="mobile-nav-top">
            <h1 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
              Juttiegram
            </h1>
            <GiHamburgerMenu
              className="hamburger"
              onClick={() => setMenu(!menu)}
            />
          </div>
          <div className="nav-links-mobile">
            {links.map((link, i) => {
              return (
                <div key={i} className="navbar-ul-mobile">
                  <Link
                    onClick={() => {
                      bye(link);
                    }}
                    to={link.path}
                    style={{
                      color: location.pathname == link.path && "#51b9ff",
                    }}
                  >
                    {link.title}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Navbar />
      )}
    </>
  );
}
