import React, { useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './create.css';
import '../main.css'
import { GlobalContext } from "../../context/context"
// import { Link, useNavigate } from 'react-router-dom';
// import logo from "../assets/logoDark.png"

const Create = () => {

  const { state, dispatch } = useContext(GlobalContext);

  const createPost = (event) => {
    event.preventDefault();

    const userLogEmail = `${state.user.email}`
    const userId = `${state.user.userId}`
    // console.log(userLogEmail)
    const postTitle = `${state.user.firstName} ${state.user.lastName}`;
    const postText = document.querySelector("#text");
    // console.log(postTitle)

    axios
      .post(`/api/v1/post`, {
        title: postTitle,
        text: postText.value,
        email: userLogEmail,
        userId: userId,
      })
      .then(function (response) {
        // console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Post Added',
          timer: 1000,
          showConfirmButton: false,
        });
      })
      .catch(function (error) {
        console.log(error);
        document.querySelector(".result").innerHTML = "Error in post submission";
      });

    postText.value = "";
  };

  return (
    <form onSubmit={createPost} className='postForm'>
      <h2 className='createNewPost'>Share a thought!</h2>
      <textarea required id="text" placeholder="Enter Text" className="postInput textarea"></textarea>
      <button type="submit" className="postButton">
        Post
      </button>
    </form>
  )
};

export default Create;