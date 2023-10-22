import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
// import Swal from 'sweetalert2';
import './home.css';
import { Post, NoPost } from '../post/post';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/context';

const Home = () => {

  let { state, dispatch } = useContext(GlobalContext);

  const [posts, setPosts] = useState([]);
  const searchInputRef = useRef(null)
  const navigate = useNavigate()
  const me = ""

  useEffect(() => {
    renderPost();
  }, [me]);

  const renderPost = () => {
    axios
      .get(`/api/v1/feed`)
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

  return (
    <div className="result">
      {!posts ? <h2 className='noPostMessage'> No Post Found </h2> : (posts.length === 0 ? (
        <div className="loadContainer">
          <h2 className="noPostMessage">No Post Found</h2>
        </div>
      ) : (
        posts.map((post, index) => (
          <Post key={index} title={post.title} text={post.text} time={post.time} postId={post._id} likedBy={post.likes} />
        ))
      ))}
    </div>
  );
};

export default Home