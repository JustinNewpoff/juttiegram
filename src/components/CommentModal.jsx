import { useState, useEffect, useRef, useContext } from "react";
import commentModal from "../styles/commentModal.scss";
import { AiFillCloseCircle } from "react-icons/ai";
import { doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/auth";
import Moment from "react-moment";
import user2 from "../assets/user2.png";

export default function CommentModal({
  showCommentModal,
  setShowCommentModal,
}) {
  const [comment, setComment] = useState("");
  const [post, setPost] = useState(null);
  const ref = useRef();
  const params = useParams();
  const currentUser = useContext(AuthContext);
  const user = currentUser.currentUser;

  useEffect(() => {
    getData();
  }, []);

  console.log(user);

  const getData = () => {
    const unsub = onSnapshot(doc(db, "posts", params.id), (doc) => {
      setPost(doc.data());
    });
  };

  const toggleModal = () => {
    setShowCommentModal(!showCommentModal);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    let comments = post.comments;

    if (comment !== "") {
      comments.push({
        comment: comment,
        userName: user.displayName,
        id: user.uid,
        time: new Date(),
        userPhoto: user.photoURL,
      });

      await setDoc(doc(db, "posts", params.id), {
        ...post,
        comment: comments,
      }).then(() => {
        getData();
      });
    }

    ref.current.value = "";
    setComment("");
  };

  return (
    <>
      <div className="modal">
        <div className="overlay">
          <div className="modal-top">
            <h2>Comments</h2>
            <AiFillCloseCircle className="close" onClick={toggleModal} />
          </div>

          {post && post.comment && (
            <div className="modal-comments">
              {post.comments.map((item, i) => {
                return (
                  <>
                    {post && (
                      <div key={i} className="comment-div">
                        <div className="comment-div-top">
                          <strong>
                            <p>{item.userName}</p>
                          </strong>

                          <div className="comment-time">
                            <strong>
                              <small>
                                <Moment fromNow>{item.time.toDate()}</Moment>
                              </small>
                            </strong>
                          </div>
                        </div>
                        <div className="comment-div-user">
                          <img
                            src={item.userPhoto || user2}
                            alt="profile picture"
                          />
                          <div className="comment-div-comment">
                            <div className="comment-comment">
                              <p>{item.comment}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          )}

          <div className="comment-input">
            <form onSubmit={submitComment}>
              <input
                type="text"
                placeholder="Write a comment..."
                onChange={(e) => setComment(e.target.value)}
                ref={ref}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
