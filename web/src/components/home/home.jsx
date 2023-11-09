import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
// import Swal from 'sweetalert2';
import './home.css';
import { Post, NoPost } from '../post/post';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/context';
import Swal from "sweetalert2"

import { baseUrl } from '../../core.mjs';
 
const Home = () => {

  let { state, dispatch } = useContext(GlobalContext);

  const [posts, setPosts] = useState([]);
  const searchInputRef = useRef(null)
  const navigate = useNavigate()
  const me = ""

  useEffect(() => {
    renderPost();

    return () => {
      // cleanup function
    };

  }, [me]);

  const renderPost = () => {
    axios
      .get(`${baseUrl}/api/v1/feed`)
      .then(function (response) {
        let fetchedPosts = response.data;
        // console.log("fetched posts", fetchedPosts);
        setPosts(fetchedPosts);
      })
      .catch(function (error) {
        // console.log(error);
        let resStatus = error.response.request.status
        // console.log(resStatus)
        if (resStatus === 401) {
          // console.log("not authorized")
          navigate('/login');
        }
      });
  };

  const deletePost = (postId) => {
    Swal.fire({
      title: 'Delete Post',
      text: 'Are you sure you want to delete this post?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      showConfirmButton: true,
      confirmButtonColor: "#284352",
      showCancelButton: true,
      cancelButtonColor: "#284352",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const response = await axios.delete(`${baseUrl}/api/v1/post/${postId}`);
          // console.log(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Post Deleted',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
          renderPost();
        } catch (error) {
          console.log(error.data);
          Swal.fire({
            icon: 'error',
            title: 'Failed to delete post',
            text: error.data,
            showConfirmButton: false
          });
        }
      }
    });
  }

  function editPost(postId) {
    axios.get(`${baseUrl}/api/v1/post/${postId}`)
      .then(response => {
        const post = response.data;

        Swal.fire({
          title: 'Edit Post',
          html: `
            <textarea id="editText" class="swal2-input text" placeholder="Post Text" required>${post.text}</textarea>
          `,
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Update',
          showConfirmButton: true,
          confirmButtonColor: "#284352",
          showCancelButton: true,
          cancelButtonColor: "#284352",
          showLoaderOnConfirm: true,
          preConfirm: () => {

            const editedText = document.getElementById('editText').value;

            if (!editedText.trim()) {
              Swal.showValidationMessage('Title and text are required');
              return false;
            }

            return axios.put(`${baseUrl}/api/v1/post/${postId}`, {
              text: editedText
            })
              .then(response => {
                // console.log(response.data);
                Swal.fire({
                  icon: 'success',
                  title: 'Post Updated',
                  timer: 1000,
                  showConfirmButton: false
                });
                renderPost();
              })
              .catch(error => {
                // console.log(error.response.data);
                Swal.fire({
                  icon: 'error',
                  title: 'Failed to update post',
                  text: error.response.data,
                  showConfirmButton: false
                });
              });
          }
        });
      })
      .catch(error => {
        // console.log(error.response.data);
        Swal.fire({
          icon: 'error',
          title: 'Failed to fetch post',
          text: error.response.data,
          showConfirmButton: false
        });
      });
  }

  return (
    <div className="result">
      {!posts ? <span className="loader"></span> : (posts.length === 0 ? (
        <div className="loadContainer">
          <span className="loader"></span>
        </div>
      ) : (
        posts.map((post, index) => (
          <Post key={index} title={post.title} text={post.text} time={post.time} postId={post._id} userId={post.userId} image={post.image} userImage={post.userImage} likedBy={post.likes} del={deletePost} edit={editPost} />
        ))
      ))}
    </div>
  );
};

export default Home