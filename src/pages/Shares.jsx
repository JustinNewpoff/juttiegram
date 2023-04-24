import { useInsertionEffect } from "react";
import { useState, useEffect, useContext } from "react";
import shares from "../styles/shares.scss";
import { toast } from "react-toastify";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { v4 } from "uuid";

export default function Shares() {
  const [data, setData] = useState([]);
  const [post, setPost] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const currentUser = useContext(AuthContext);
  let user = currentUser.currentUser;
  const params = useParams();
  const id = v4();
  const navigate = useNavigate();

  const getPost = async () => {
    await getDoc(doc(db, "posts", params.id)).then((response) => {
      setPost({ ...response.data() });
    });
  };

  const getData = async () => {
    const arr = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    let filteredArr = arr.filter((item) => {
      return item.id !== user.uid;
    });
    setData(filteredArr);
  };

  useEffect(() => {
    getData();
    getPost();
  }, []);

  const selectUser = (person) => {
    if (selectedUsers.find((item) => item.id === person.id)) {
      setSelectedUsers(
        selectedUsers.filter((item) => {
          return item.id !== person.id;
        })
      );
    } else {
      setSelectedUsers([...selectedUsers, person]);
    }
    {
    }
  };

  const sharePost = () => {
    selectedUsers.forEach((person) => {
      let tempShares = person.shares ?? [];
      tempShares.push({
        ...post,
        sharedBy: user.uid,
        sharedFrom: user.displayName,
      });
      setDoc(doc(db, "users", person.id), {
        ...person,
        shares: tempShares,
      }).then(() => {
        navigate("/");
      });
    });

    toast.success("Post shared successfully");
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="shares">
        <div className="shares-image">
          {post && <img src={post.imageURL} alt="post picture" />}
        </div>
        <div className="users">
          {data &&
            data.map((item, i) => {
              let alreadySelected = selectedUsers.find((user) => {
                return item.id === user.id;
              });
              return (
                <div
                  key={i}
                  className="user"
                  onClick={() => selectUser(item)}
                  style={{ border: alreadySelected ? "2px solid blue" : "" }}
                >
                  <p>{item.displayName}</p>
                </div>
              );
            })}
        </div>
        <div className="share-btn">
          {selectedUsers.length > 0 && (
            <button onClick={sharePost}>Share Post</button>
          )}
        </div>
      </div>
    </>
  );
}
