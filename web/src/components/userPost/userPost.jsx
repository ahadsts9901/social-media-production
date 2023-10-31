import "./userPost.css";
import moment from "moment";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/context";
import { useNavigate } from "react-router-dom";

const UserPost = (props) => {
  let { state, dispatch } = useContext(GlobalContext);

  const navigate = useNavigate()

  useEffect(() => {
    if (!Array.isArray(props.likedBy)) {
      props.likedBy = [];
    }

    const userHasLiked = props.likedBy.some(
      (likeUser) => likeUser.userId === state.user.userId
    );

    setIsLike(userHasLiked);
  }, [props.likedBy, state.user.userId]);

  const [showFullPost, setShowFullPost] = useState(false);
  const [isLike, setIsLike] = useState(false);

  const formattedTime = moment(props.time).fromNow();
  const fullText = props.text;
  const splittedText = props.text.split(" ").slice(0, 40).join(" ");

  const toggleShowFullPost = () => {
    setShowFullPost(!showFullPost);
  };

  const doLike = async (_id, event) => {
    try {
      // Create an empty array if props.likedBy is undefined
      if (!Array.isArray(props.likedBy)) {
        props.likedBy = [];
      }

      // Debugging: Log the values to understand what's happening
      // console.log("state.user.userId:", state.user.userId);
      // console.log("props.likedBy:", props.likedBy);

      const userHasLiked = props.likedBy.some(
        (likeUser) => likeUser.userId === state.user.userId
      );

      if (userHasLiked) {
        // console.log("You've already liked this post.");
        undoLike(_id);
        return;
      }

      // Make the API call to add the like
      const response = await axios.post(`/api/v1/post/${_id}/dolike`, {
        userId: state.user.userId,
        profileImage : state.user.profileImage
      });

      if (response.data === "Like added successfully") {
        setIsLike(true);
        // Update the like button
      } else {
        // console.log("Failed to add like.");
      }

      let thumb = event.target.firstElementChild;
      thumb.classList.remove("bi-hand-thumbs-up");
      thumb.classList.add("bi-hand-thumbs-up-fill");
      setIsLike(true);
    } catch (error) {
      // Handle error
      console.log("Error adding like:", error);
    }
  };

  const undoLike = async (_id, event) => {
    try {
      // Make the API call to remove the like
      const response = await axios.delete(`/api/v1/post/${_id}/undolike`, {
        data: { userId: state.user.userId },
      });

      if (response.data === "Like removed successfully") {
        setIsLike(false); // Update the like button
      } else {
        // Handle the case where the undo like API fails
        // console.log("Failed to remove like.");
      }

      let thumb = event.target.firstElementChild;
      thumb.classList.add("bi-hand-thumbs-up");
      thumb.classList.remove("bi-hand-thumbs-up-fill");
      setIsLike(false);
    } catch (error) {
      // Handle error
      console.log("Error removing like:", error);
    }
  };

  const seePost = (postId) => {
    navigate(`/post/${postId}`);
  };

  const getProfile = async (userId) => {
    navigate(`/profile/${userId}`)
  }

  return (
    <div className="singlePost">
      <div className="postHead" onClick={() => { getProfile(props.userId) }}>
        <img
          src={props.userImage || `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`}
          alt="Profile"
        />
        <div className="postNames">
          <h2>{props.title}</h2>
          <p>{formattedTime}</p>
        </div>
      </div>
      <div className="textContainer" >
        <p className={`${fullText.length <= 40 ? (props.image ? "smallText" : "bigText") : "smallText"}`}>
          <span onClick={() => { seePost(props.postId) }} >{showFullPost ? fullText : splittedText}</span>
          {splittedText !== fullText && (
            <span className="see" onClick={toggleShowFullPost}>
              {showFullPost ? "...see less" : "...see more"}
            </span>
          )}
        </p>
        {props.image && <img src={props.image} alt="post image" className="postImg" />}
      </div>
      <div className="buttonContainer">
        <button
          onClick={(event) => {
            doLike(props.postId, event);
          }}
        >
          <i
            className={`bi ${!isLike ? "bi-hand-thumbs-up" : "bi-hand-thumbs-up-fill"
              }`}
          ></i>{" "}
          <span id="likesCount">
            {props.likedBy ? props.likedBy.length : 0}
          </span>{" "}
          {props.likedBy
            ? props.likedBy.length == 1
              ? "Like"
              : "Likes"
            : "Likes"}
        </button>
        <button
          onClick={() => {
            seePost(props.postId);
          }}
        >
          <i className="bi bi-chat-square"></i>Comment
        </button>
        <button>
          <i className="bi bi-share-fill"></i>Share
        </button>
      </div>
      <div className="buttonContainer">
        <button
          className="editDelBtns"
          onClick={() => props.edit(props.postId)}
        >
          <i className="bi bi-pencil-fill"></i>Edit
        </button>
        <button className="editDelBtns" onClick={() => props.del(props.postId)}>
          <i className="bi bi-trash-fill"></i>Delete
        </button>
      </div>
    </div>
  );
};

const NoPost = () => {
  return <h2 className="noPostsMessage">No post found...</h2>;
};

export { UserPost, NoPost };
