import React, { useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./create.css";
import "../main.css";
import { GlobalContext } from "../../context/context";
import { useRef } from "react";
import { useState } from "react";
// import { Link, useNavigate } from 'react-router-dom';
// import logo from "../assets/logoDark.png"

const Create = () => {
  const { state, dispatch } = useContext(GlobalContext);

  const [selectedImage, setSelectedImage] = useState("");

  const fileInputRef = useRef("");

  const createPost = (event) => {
    event.preventDefault();

    let formData = new FormData();

    const userLogEmail = `${state.user.email}`;
    const userId = `${state.user.userId}`;
    const postTitle = `${state.user.firstName} ${state.user.lastName}`;
    const postText = document.querySelector("#text");

    formData.append("postTitle", postTitle);
    formData.append("postText", postText.value);
    formData.append("image", fileInputRef.current.files[0]);
    formData.append("userLogEmail", userLogEmail);
    formData.append("userId", userId);
    formData.append("userImage", state.user.profileImage);

    axios
      .post(`/api/v1/post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        // console.log(response.data);
        Swal.fire({
          icon: "success",
          title: "Post Added",
          timer: 1000,
          showConfirmButton: false,
        });
      })
      .catch(function (error) {
        console.log(error)
      });

    postText.value = "";
    setSelectedImage("")
  };

  return (
    <form onSubmit={createPost} className="postForm">
      <h2 className="createNewPost">Share a thought!</h2>
      <label htmlFor="file">
        <h1 className="bi bi-file-image"></h1>
      </label>
      <input
        ref={fileInputRef}
        id="file"
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const base64Url = URL.createObjectURL(e.target.files[0]);
          setSelectedImage(base64Url);
        }}
      />
      <textarea
        id="text"
        placeholder="Enter Text"
        className="postInput textarea"
      ></textarea>

      <div className="selectedFile">
        {selectedImage && <img className="selectedFile" src={selectedImage} alt="selected image" />}
      </div>

      <button type="submit" className="postButton">
        Post
      </button>
    </form>
  );
};

export default Create;
