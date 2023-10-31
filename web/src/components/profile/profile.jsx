import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './profile.css';
import { UserPost } from '../userPost/userPost';
import { Post } from "../post/post"
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../context/context';
import { PencilFill } from 'react-bootstrap-icons'
import { useRef } from 'react';

const Profile = () => {

  let { state, dispatch } = useContext(GlobalContext);

  const [userPosts, setUserPosts] = useState([]);
  const [profile, setProfile] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null)

  const fileInputRef = useRef()

  // const userId = state.user.userId
  const { userParamsId } = useParams()

  useEffect(() => {
    renderCurrentUserPost();
    getProfile()

    return () => {
      // cleanup function
    };

  }, [userParamsId]);

  if (selectedImage) {

    Swal.fire({
      title: 'Edit Profile',
      html: `
        <img src="${selectedImage}" class="profileImageSelect" />
      `,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Upload",
      cancelButtonColor: "#284352",
      confirmButtonColor: "#284352",
    }).then((result) => {
      if (result.isConfirmed) {

        let formData = new FormData();

        formData.append("profileImage", fileInputRef.current.files[0]);
        formData.append("userId", state.user.userId);

        axios
          .post(`/api/v1/profilePicture`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(function (response) {
            // console.log(response.data);
            Swal.fire({
              icon: "success",
              title: "Profile Updated",
              timer: 1000,
              showConfirmButton: false,
            });
          })
          .catch(function (error) {
            console.log(error);
          });

        setSelectedImage("")

      }
    });


  }

  const renderCurrentUserPost = () => {
    axios.get(`/api/v1/posts/${userParamsId || ""}`)
      .then((response) => {
        // Handle the data returned from the API
        const userAllPosts = response.data;
        // console.log(userAllPosts)
        setUserPosts(userAllPosts)
        // This will contain the posts for the specified email
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error('Axios error:', error);
      });
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(`/api/v1/profile/${userParamsId || ""}`);
      setProfile(response.data.data);
    } catch (error) {
      console.log(error.data);
      setProfile("noUser")
    }
  }

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
          const response = await axios.delete(`/api/v1/post/${postId}`);
          // console.log(response.data);
          Swal.fire({
            icon: 'success',
            title: 'Post Deleted',
            timer: 1000,
            showCancelButton: false,
            showConfirmButton: false
          });
          renderCurrentUserPost();
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
    axios.get(`/api/v1/post/${postId}`)
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

            return axios.put(`/api/v1/post/${postId}`, {
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
                renderCurrentUserPost();
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


  const logOut = (event) => {
    event.preventDefault();

    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Log Out',
      confirmButtonColor: '#284352',
      cancelButtonColor: '#284352',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        // Handle the logout logic here
        return axios
          .post(`/api/v1/logout`, {})
          .then(function (response) {
            dispatch({
              type: 'USER_LOGOUT',
            });
            window.location.pathname = '/login';
            return true;
          })
          .catch(function (error) {
            Swal.fire({
              icon: 'error',
              title: "Can't logout",
              timer: 1000,
              showConfirmButton: false,
            });
            return false;
          });
      },
    });
  };


  return (
    <div className='posts'>

      {profile === "noUser" ? (<div className='noUser'>No User Found</div>) :

        <>
          <div className="profile">
            <img className='profileIMG' src={profile.profileImage || `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`} />

            <h2 className='profileName'>{profile.firstName} {profile.lastName}

              {(state.user.userId === profile.userId) ? <PencilFill className='pencil' /> : null}
            </h2>

            {(state.user.userId === profile.userId) ?
              <button className='logOutButton' onClick={logOut}>Log Out</button>
              : null}
            <div className='profileImageContainer'>
              <label className='editIMG' htmlFor="profileImage">

                {(state.user.userId === profile.userId) ? <PencilFill className='pencil' /> : null}

              </label>
              <input type="file" ref={fileInputRef} className="file hidden" id="profileImage" accept="image/*" onChange={(e) => {
                const base64Url = URL.createObjectURL(e.target.files[0]);
                setSelectedImage(base64Url);
              }} />
            </div>
          </div>

          <div className="result">
            {!userPosts ? <h2 className="noPostMessage">No Post Found</h2> : (userPosts.length === 0 ? (
              <div className="loadContainer">
                <h2 className="noPostMessage">No Post Found</h2>
              </div>
            ) : (
              userPosts.map((post, index) => (

                (state.user.userId === profile.userId || state.isAdmin == true) ?
                  (<UserPost key={index} title={post.title} text={post.text} time={post.time} postId={post._id} image={post.image} userId={post.userId} userImage={post.userImage} del={deletePost} edit={editPost} likedBy={post.likes} />)
                  :
                  (<Post key={index} title={post.title} text={post.text} time={post.time} postId={post._id} userId={post.userId} image={post.image} likedBy={post.likes} userImage={post.userImage} />)

              ))
            ))}
          </div>
        </>

      }

    </div>
  );
};

export default Profile