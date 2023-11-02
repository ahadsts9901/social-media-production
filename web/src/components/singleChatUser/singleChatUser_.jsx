import React from 'react'
import "./SingleChatUser.css"
import { useNavigate } from 'react-router-dom'

const SingleChatUser_ = (props) => {

  const navigate = useNavigate()

  return (
    <div className='singleChatUser' onClick={() => { navigate(`/chat/${props.userId}`) }} >
      <img src={props.image || `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`} />
      <p className='chatUserName'>{props.userName}</p>
      {/* <span id="lastSeen">
        today at 09:30 AM
      </span> */}
    </div>
  )
}

export default SingleChatUser_
