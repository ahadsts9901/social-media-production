import "./userPost.css";
import moment from "moment";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/context";
import { useNavigate } from "react-router-dom";

import { baseUrl } from "../../core.mjs";

const UserPost = (props) => {
  let { state, dispatch } = useContext(GlobalContext);

  const [totalComments, setTotalComments] = useState("");

  const navigate = useNavigate();

  const postId = props.postId;

  useEffect(() => {
    getComments(postId);
  }, [postId]);

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
        undoLike(_id, event);
        return;
      }

      // Make the API call to add the like
      const response = await axios.post(
        `${baseUrl}/api/v1/post/${_id}/dolike`,
        {
          userId: state.user.userId,
          profileImage: state.user.profileImage,
        }
      );

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
      const response = await axios.delete(
        `${baseUrl}/api/v1/post/${_id}/undolike`,
        {
          data: { userId: state.user.userId },
        }
      );

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
    navigate(`/profile/${userId}`);
  };

  const getComments = async (postId) => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/comments/${postId}`);
      const comments = response.data;
      setTotalComments(comments.length);
    } catch (error) {
      console.error("An error occurred while fetching comments:", error);
    }
  };

  return (
    <div className="singlePost">
      <div
        className="postHead"
        onClick={() => {
          getProfile(props.userId);
        }}
      >
        <img src={props.userImage} alt="Profile" />
        <div className="postNames">
          <h2>{props.title}</h2>
          <p>{formattedTime}</p>
        </div>
      </div>
      <div className="textContainer">
        <p
          className={`${
            fullText.length <= 40
              ? props.image
                ? "smallText"
                : "bigText"
              : "smallText"
          }`}
        >
          <span
            onClick={() => {
              seePost(props.postId);
            }}
          >
            {showFullPost ? fullText : splittedText}
          </span>
          {splittedText !== fullText && (
            <span className="see" onClick={toggleShowFullPost}>
              {showFullPost ? "...see less" : "...see more"}
            </span>
          )}
        </p>
        {props.image && (
          <img src={props.image} width="425" height="300" alt="post image" className="postImg" />
        )}
      </div>
      <div className="buttonContainer">
        <button
          onClick={(event) => {
            doLike(props.postId, event);
          }}
        >
          <i
            className={`bi ${
              !isLike ? "bi-hand-thumbs-up" : "bi-hand-thumbs-up-fill"
            }`}
          ></i>
          <span id="likesCount">
            Likes
            {props.likedBy
              ? props.likedBy.length == 0
                ? ""
                : ` ( ${props.likedBy.length} )`
              : null}
          </span>
        </button>
        <button
          onClick={() => {
            seePost(props.postId);
          }}
        >
          <i className="bi bi-chat-square"></i>
          {totalComments == 0 ? (
            "Comments"
          ) : (
            <p>Comments ( {totalComments} )</p>
          )}
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
