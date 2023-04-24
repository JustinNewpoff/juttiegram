import { useState, useEffect, useContext } from "react";
import { AiFillHeart } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { BiUserCircle } from "react-icons/bi";
import post from "../styles/post.scss";
import Loader from "../components/Loader";

export default function Post() {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const currentUser = useContext(AuthContext);
  const user = currentUser.currentUser;
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getUsers = () => {};

  const getData = async () => {
    setLoading(true);
    const citiesRef = collection(db, "posts");
    const q = query(citiesRef, orderBy("timestamp", "desc"));
    const arr = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    setData(arr);
    setLoading(false);
  };

  useEffect(() => {
    getData();
    getUsers();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="upload-container">
          {data.length > 0 ? (
            data.map((item, i) => {
              return (
                <div key={i} className="upload-content">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/post/${item.id}`)}
                    key={i}
                    className="post"
                  >
                    <div className="post-top">
                      <div className="post-logo">
                        {item.profilePic === "" ? (
                          <BiUserCircle className="post-no-user" />
                        ) : (
                          <img src={item.profilePic} />
                        )}
                      </div>
                      <h4>{item.name}</h4>
                    </div>
                    <div className="post-middle">
                      <img
                        className="post-img"
                        src={item.imageURL}
                        alt="post picture"
                      />
                    </div>
                    <div className="post-bottom">
                      <AiFillHeart className="bottom-icon" />
                      <p className="count">{item.likes.length}</p>
                      <BsChatDots className="bottom-icon" />
                      <p className="count">{item.comments.length}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h1>No posts</h1>
          )}
        </div>
      )}
    </>
  );
}
