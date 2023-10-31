import React
, { useState, useRef }
  from 'react';
import axios from 'axios';
// import Swal from 'sweetalert2';
import './search.css';
import '../main.css'
// import logo from "../assets/logoDark.png"
import { Search as SearchBS, ArrowLeft } from "react-bootstrap-icons"
import { Post } from "../post/post"

const Search = () => {

  const [posts, setPosts] = useState([]);
  const searchInputRef = useRef(null)

  const search = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/v1/search?q=${searchInputRef.current.value}`);
      // console.log(response.data);

      setPosts([...response.data]);
    } catch (error) {
      console.log(error.data);
    }
    e.target.reset()
  };

  return (
    <div className="searchCont">
      <form className='search postForm' onSubmit={search}>
        <button type='button' className='searchButton' onClick={() => { window.history.back() }}><ArrowLeft /></button>
        <input required type="search" placeholder="Search Here..." className="searchInput" ref={searchInputRef} />
        <button type="submit" className="postButton searchButton">
          <SearchBS />
        </button>
      </form>
      <div className="searchResult">
        {posts.length === 0 ? (
          <h2 className='noPostMessage'> <SearchBS/> Search Post . . . </h2>
        ) : (
          posts.map((post, index) => (
            <Post image={post.image} key={index} title={post.title} text={post.text} time={post.time} postId={post._id} />
          ))
        )}
      </div>
    </div>
  )
};

export default Search;