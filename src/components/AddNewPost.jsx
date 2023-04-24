import { useState, useEffect, useContext } from "react";
import { storage, db } from "../firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import { AiFillCamera } from "react-icons/ai";
import addNewPost from "../styles/addNewPost.scss";
import { AuthContext } from "../context/auth";
import { v4 } from "uuid";

export default function AddNewPost() {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userUrl, setUserUrl] = useState(null);

  const currentUser = useContext(AuthContext);
  const user = currentUser.currentUser;
  const navigate = useNavigate();

  const id = v4();

  const url = async () => {
    console.log(users);
  };

  const getUsers = async () => {
    const arr = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    const filtered = arr.filter((item) => item.id === user.uid);
    setUserUrl(filtered[0].profilePicURL);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const grabPicture = (e) => {
    setImage(e.target.files[0]);
  };

  const submit = (e) => {
    e.preventDefault();
    if (image === null) {
      toast.error("Please add an image");
    } else {
      setLoading(true);

      const storageRef = ref(storage, image.name);

      uploadBytes(storageRef, image)
        .then((snapshot) => {})
        .then(() => {
          getDownloadURL(ref(storage, image.name)).then((url) => {
            setDoc(doc(db, "posts", id), {
              name: user.displayName,
              imageURL: url,
              description,
              likes: [],
              comments: [],
              email: user.email,
              id: id,
              timestamp: serverTimestamp(),
              profilePic: userUrl,
            })
              .then(() => {
                toast.success("Post created successfully");
                navigate("/");
                setLoading(false);
              })
              .catch(() => {
                toast.error("Something went wrong");
              });
          });
        });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="new-post-container">
          <h1 className="new-post-h1">Add New Post</h1>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            id=""
            cols="70"
            rows="5"
            placeholder="Enter description....."
          ></textarea>
          <label htmlFor="camera">
            <AiFillCamera style={{ cursor: "pointer" }} className="camera" />
          </label>
          <input
            className="new-post-file"
            id="camera"
            type="file"
            accept="image/*"
            onChange={grabPicture}
            style={{ display: "none" }}
          />
          {description.length > 0 && <button onClick={submit}>Add Post</button>}
        </div>
      )}
    </>
  );
}
