import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AiOutlineHeart } from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { BiShare } from "react-icons/bi";
import { AuthContext } from "../context/auth";
import { toast } from "react-toastify";
import PostEdit from "../styles/PostEdit.scss";
import Navbar from "../components/Navbar";
import CommentModal from "../components/CommentModal";
import LikesModal from "../components/LikesModal";
import description from "../styles/description.scss";
export default function Description() {
  const [post, setPost] = useState(null);
  const [like, setLike] = useState(false);
  const [comments, setComments] = useState("");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [displayComments, setDisplayComments] = useState(false);
  const myRef = useRef();
  let params = useParams();
  const navigate = useNavigate();
  const currentUser = useContext(AuthContext);
  let user = currentUser.currentUser;

  const toggleCommentModal = () => {
    setShowCommentModal(!showCommentModal);
  };

  const toggleLikesModal = () => {
    setShowLikesModal(!showLikesModal);
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const unsub = onSnapshot(doc(db, "posts", params.id), (doc) => {
      setPost(doc.data());
      if (
        doc.data().likes.find((item) => {
          return item.id === user.uid;
        })
      ) {
        setLike(true);
      } else {
        setLike(false);
      }
    });
  };

  const flipLikes = () => {
    setShowLikesModal(!showLikesModal);
  };

  const likeUnlike = () => {
    let likes = post.likes;

    if (like) {
      likes = post.likes.filter((users) => {
        return users.id !== user.uid;
      });
    } else {
      likes.push({
        id: user.uid,
        email: user.email,
        name: user.displayName,
        userPhoto: user.photoURL,
      });
    }

    setDoc(doc(db, "posts", post.id), {
      ...post,
      likes: likes,
    }).then(() => {
      getData();
    });
  };

  const sendComment = () => {
    let commentList = post.comments;

    commentList.push({
      comment: comments,
    });

    setDoc(doc(db, "posts", post.id), {
      ...post,
      comments: commentList,
    }).then(() => {
      getData();
    });
    myRef.current.value = "";
  };

  return (
    <>
      <Navbar />
      {post && (
        <div className="description">
          <h1>{post.description}</h1>
          <div className="description-image">
            <img className="single-img" src={post.imageURL} alt="" />
          </div>
          {displayComments && (
            <div>
              {post.comments.map((item) => {
                return <h4>{item.comment}</h4>;
              })}
            </div>
          )}
          <div className="likes-comments">
            <AiOutlineHeart
              style={{ cursor: "pointer", color: like ? "red" : "" }}
              onClick={likeUnlike}
            />
            <p onClick={flipLikes} style={{ cursor: "pointer" }}>
              {post.likes.length}
            </p>
            <BsChatDots
              style={{ cursor: "pointer" }}
              onClick={toggleCommentModal}
            />
            <p>{post.comments.length}</p>
            <BiShare
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/shares/${params.id}`)}
            />
          </div>
        </div>
      )}
      {showCommentModal && (
        <CommentModal
          showCommentModal={showCommentModal}
          setShowCommentModal={setShowCommentModal}
        />
      )}
      {showLikesModal && post.likes.length > 0 && (
        <LikesModal
          showLikesModal={showLikesModal}
          setShowLikesModal={setShowLikesModal}
        />
      )}
    </>
  );
}
