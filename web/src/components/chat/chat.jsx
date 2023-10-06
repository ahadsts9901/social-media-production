import React
  // , { useState, useRef }
  from 'react';
// import axios from 'axios';
// import Swal from 'sweetalert2';
import './chat.css';
import '../main.css'
// import { Link, useNavigate } from 'react-router-dom';
// import logo from "../assets/logoDark.png"
import {ArrowLeft} from "react-bootstrap-icons"

const Chat = () => {

  return (
    <div className='chatCont'>
      <div className='test'>
      <button type='button' className='searchButton' onClick={() => { window.history.back() }}><ArrowLeft /> Go Back</button>
        <h2> Chat</h2>
        <h2>Under Construction</h2>
      </div>
    </div>
  )
};

export default Chat;