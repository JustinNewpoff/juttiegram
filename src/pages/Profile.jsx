import { useState, useEffect, useContext } from "react";
import profile from "../styles/profile.scss";
import Navbar from "../components/Navbar";
import { FaTrashAlt } from "react-icons/fa";
import { AuthContext } from "../context/auth";
import { updateProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db, storage, auth } from "../firebase";
import { useParams } from "react-router-dom";
import { AiFillCamera } from "react-icons/ai";
import user2 from "../assets/user2.png";
import { toast } from "react-toastify";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const [data, setData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");

  const currentUser = useContext(AuthContext);
  let user = currentUser.currentUser;
  let params = useParams();

  const getData = async () => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      setData(doc.data());
    });
  };

  const getPosts = async () => {
    const arr = [];
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    setPosts(arr.filter((post) => post.email === user.email));
  };

  useEffect(() => {
    if (profilePicture !== "") {
      const storageRef = ref(storage, profilePicture.name);
      uploadBytes(storageRef, profilePicture)
        .then((snapshot) => {
          console.log("Uploaded a blob or file!");
        })
        .then(() => {
          getDownloadURL(ref(storage, profilePicture.name)).then((url) => {
            updateDoc(doc(db, "users", user.uid), {
              profilePicURL: url,
            }).then(() => {
              updateProfile(auth.currentUser, {
                photoURL: url,
              });
            });
          });
        });
    }
  }, [profilePicture]);

  useEffect(() => {
    getData();
    getPosts();
  }, []);

  const deletePost = async (item) => {
    await deleteDoc(doc(db, "posts", item.id)).then(() => {
      getPosts();
      toast.success("Post deleted");
    });
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        {data && (
          <div className="profile-info">
            <div className="profile-top">
              <img src={data.profilePicURL || user2} alt="profile picture" />
              <div className="change-photo-overlay">
                <label htmlFor="profile-photo">
                  <AiFillCamera className="profile-camera" />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="profile-photo"
                  style={{ display: "none" }}
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                />
              </div>
              <div className="profile-name">
                <h1>{data.displayName}</h1>
              </div>
            </div>
          </div>
        )}
        <hr />
        <h3 className="profile-heading">Uploads</h3>
        <div className="profile-bottom">
          {posts &&
            posts.map((post, i) => {
              return (
                <div key={i} className="profile-post">
                  <img src={post.imageURL} alt="post image" />
                  <div className="profile-post-overlay">
                    <FaTrashAlt
                      className="trash"
                      style={{ color: "white" }}
                      onClick={() => deletePost(post)}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
