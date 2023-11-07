import React, { useState, useContext } from "react";
import "./SingleComment.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "react-bootstrap-icons";
import { GlobalContext } from "../../context/context";

const SingleComment = (props) => {
  let { state, dispatch } = useContext(GlobalContext);

  const [showFullComment, setShowFullComment] = useState(false);
  const formattedTime = moment(props.time).fromNow();
  const fullComment = props.comment;
  const splittedComment = props.comment.split(" ").slice(0, 20).join(" ");

  const [showAction, setShowAction] = useState(false);

  const navigate = useNavigate();

  const toggleShowFullComment = () => {
    setShowFullComment(!showFullComment);
  };

  return (
    <div className="singleComment">
      {state.user.userId === props.userId || state.user.isAdmin == true ? (
        <div className="actionContComment">
          {showAction ? (
            <>
              <ChevronUp
                onClick={() => {
                  setShowAction(!showAction);
                }}
              />
              <div className="commentMenu">
                <p
                  onClick={(event) => {
                    props.edit(props._id, event);
                  }}
                >
                  Edit
                </p>

                <p
                  onClick={() => {
                    props.del(props._id);
                  }}
                >
                  Delete
                </p>
              </div>
            </>
          ) : (
            <ChevronDown
              onClick={() => {
                setShowAction(!showAction);
              }}
            />
          )}
        </div>
      ) : null}
      <div
        className="singleCommentHead"
        onClick={() => {
          navigate(`/profile/${props.userId}`);
        }}
      >
        <img src={props.image} alt="image" />
        <b>{props.userName}</b>
        <span id="time">{formattedTime}</span>
      </div>
      <div className="commentTextContainer">
        <p className="commentText">
        <span className="leftFloatComment">mm</span>
          <span>{showFullComment ? fullComment : splittedComment}</span>
          {splittedComment !== fullComment && (
            <span className="see" onClick={toggleShowFullComment}>
              {showFullComment ? "...see less" : "...see more"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default SingleComment;
