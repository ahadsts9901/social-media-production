import './likeUsers.css';
import '../main.css'
import React, { useContext } from 'react';
import { GlobalContext } from '../../context/context';
import profileImg from "../assets/profileimg.webp"

const LikeUsers = (props) => {

  let { state, dispatch } = useContext(GlobalContext);

  return (
    <div className='likeUsersCont' onClick={() => {props.getUser(props.userId)}} >
      <img src={props.profileImage || `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`} alt='profile image'/>
      <div>
      <h3 className='likeUserName'>{props.firstName} {props.lastName}</h3>
      <p className="seeUser bi bi-arrow-up-right-square" ></p>
      </div>
    </div>
  );

};

export default LikeUsers;