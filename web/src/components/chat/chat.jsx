import React, { useEffect, useState, useContext } from 'react'
import "./chat.css"
import "../chatScreen/chatScreen.css"
import { ArrowLeft, ThreeDotsVertical, Search as SearchBs } from "react-bootstrap-icons"
import SingleChatUser from '../singleChatUser/singleChatUser'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../context/context';

import { baseUrl } from '../../core.mjs';
 
const Chat = () => {
  
  let { state, dispatch } = useContext(GlobalContext);

  const [users, setUsers] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const allUsersChat = async () => {
      axios.get(`${baseUrl}/api/v1/chat`)
        .then((response) => {
          const allUsers = response.data;
          setUsers(allUsers)
          // console.log(allUsers);
        })
        .catch((error) => {
          console.error('Axios error:', error);
        });
    };

    allUsersChat();

    return () => {
      // cleanup function
    };

  }, []);

  return (
    <div className='chatUsers'>
      <header>
        <div className='headSect'>
          <ArrowLeft onClick={() => { window.history.back() }} />
          <img className='chatScreenImg' src={state.user.profileImage} alt="image" />
          <b>{`${state.user.firstName} ${state.user.lastName}`}</b>
        </div>
        <div className='headSect'>
          <ThreeDotsVertical />
        </div>
      </header>
      <form id='chatSearch'>
        <input type="search" placeholder='Search Here . . .' />
        <button type='submit'><SearchBs /></button>
      </form>
      <div className='chatUsersChats'>
      {!users ? <span id="loader"></span> : (users.length === 0 ? (
              <div className="loadContainer">
                <span id="loader"></span>
              </div>
            ) : (
              users.map((user, index) => (

                <SingleChatUser image={user.profileImage} userName={`${user.firstName} ${user.lastName}`} userId={user._id} userEmail={user.email}/>

              ))
            ))}
      </div>
    </div>
  )
}

export default Chat