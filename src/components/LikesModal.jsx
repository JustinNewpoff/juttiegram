import { useState, useEffect, useContext } from "react";
import likesModal from "../styles/likesModal.scss";
import { AiFillCloseCircle } from "react-icons/ai";
import { doc, onSnapshot, getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/auth";
import user2 from "../assets/user2.png";

export default function LikesModal({ showLikesModal, setShowLikesModal }) {
  const [data, setData] = useState({});
  const [users, setUsers] = useState([]);
  const params = useParams();
  const currentUser = useContext(AuthContext);
  let user = currentUser.currentUser;

  const getData = () => {
    const unsub = onSnapshot(doc(db, "posts", params.id), (doc) => {
      setData(doc.data());
    });
  };

  const getUsers = async () => {
    const arr = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    setUsers(arr);
  };

  useEffect(() => {
    getData();
    getUsers();
  }, []);

  const toggleModal = () => {
    setShowLikesModal(!showLikesModal);
  };
  return (
    <div className="modal likes">
      <div className="overlay">
        <div className="modal-top likes-top">
          <h2>Likes</h2>
          <AiFillCloseCircle className="close" onClick={toggleModal} />
        </div>
        <div className="modal-comments modal-likes">
          {data.likes && (
            <>
              {data.likes.map((item, i) => {
                return (
                  <div key={i} className="comment-div likes-div">
                    <img src={item.userPhoto || user2} />
                    <p>{item.name}</p>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
