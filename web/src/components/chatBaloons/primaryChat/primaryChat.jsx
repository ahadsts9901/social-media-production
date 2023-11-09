import React, { useState, useContext } from "react";
import "./primaryChat.css";
import { ChevronDown, PencilFill, TrashFill, ChevronUp } from "react-bootstrap-icons";
import moment from "moment"
import { GlobalContext } from "../../../context/context";

import { baseUrl } from '../../../core.mjs';
 
const PrimaryChat = (props) => {

  let { state, dispatch } = useContext(GlobalContext);
  const time = moment(props.time).fromNow();

  const [showAction, setShowAction] = useState(false)

  return (

    <div className="message">
      <div className="userMessage">
        <p>
          {props.message}
        </p>
        <span className="messageDetails">
          <p id="chatTime">{time}</p>

          {
            state.user.userId === props.from_id ?
              showAction ? <ChevronUp onClick={() => { setShowAction(!showAction) }} style={{ marginTop: "0.3em" }
              } /> :
                <ChevronDown onClick={() => { setShowAction(!showAction) }} style={{ marginTop: "0.3em" }} />
              : null
          }

        </span>
        {
          state.user.userId === props.from_id ?
            (showAction ? <div className="chatActionCont">
              < p onClick={() => { props.del(props._id) }}> <TrashFill /> Delete</p>
              <p onClick={(event) => { props.edit(props._id, event) }} ><PencilFill /> Edit</p>
            </div> : null)
            : null
        }
      </div >
      <div className="messageTail"></div>
    </div >
  );
};

export default PrimaryChat