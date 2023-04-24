import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { getDoc, doc, deleteField, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/auth";
import { useNavigate } from "react-router-dom";
import sharedPost from "../styles/sharedPost.scss";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

export default function SharedPost() {
  const [posts, setPosts] = useState([]);
  const [shares, setShares] = useState(null);
  const currentUser = useContext(AuthContext);
  let user = currentUser.currentUser;
  const navigate = useNavigate();

  const getData = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setShares(docSnap.data().shares);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteShares = async (share) => {
    const shareRef = doc(db, "users", user.uid);

    await updateDoc(shareRef, {
      shares: deleteField(),
    });
    getData();
  };

  return (
    <div>
      <Navbar />
      {shares ? (
        <div className="shares-container">
          <div className="shared-post-overlay">
            <h1>Delete shared posts</h1>
            <FaTrashAlt className="trash" onClick={deleteShares} />
          </div>
          {shares &&
            shares.map((item, i) => {
              return (
                <div key={i}>
                  <div className="shares-div">
                    <img
                      src={item.imageURL}
                      alt="shared post image"
                      onClick={() => navigate(`/post/${item.id}`)}
                    />

                    <p>
                      Shared by: <strong>{item.sharedFrom}</strong>
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <h1 className="no-posts">No shares</h1>
      )}
    </div>
  );
}
