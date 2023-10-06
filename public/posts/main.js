// create post

function createPost(event) {
    event.preventDefault()
    let postTitle = document.querySelector("#title");
    let postText = document.querySelector("#text");

    let timestamp = new Date().toISOString();

    // baseUrl/api/v1/post
    axios.post(`/api/v1/post`, {
            title: postTitle.value,
            text: postText.value,
        })
        .then(function(response) {
            // console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Post Added',
                timer: 1000,
                showConfirmButton: false
            });
            renderPost();
        })
        .catch(function(error) {
            // handle error
            // console.log(error.data);
            document.querySelector(".result").innerHTML = "error in post submission"
        })

    postTitle.value = ""
    postText.value = ""
}

// render posts

function renderPost() {
    // baseUrl/api/v1/post
    axios.get(`/api/v1/posts`, {
            withCredentials: true
        })
        .then(function(response) {

            let posts = response.data;
            let postContainer = document.querySelector(".result");
            postContainer.innerHTML = "";

            if (posts.length === 0) {
                let noPostsMessage = document.createElement("h2");
                noPostsMessage.textContent = "No post found...";
                noPostsMessage.className = "noPostsMessage";
                postContainer.appendChild(noPostsMessage);
            } else {
                posts.forEach(function(post) {
                    let postElement = document.createElement("div");
                    postElement.className += " post"

                    let time = document.createElement("p")
                    time.className += " regards center"
                    time.style.fontSize = " 0.7em"
                    time.textContent = moment(post.time).fromNow()
                    postElement.appendChild(time)

                    let titleElement = document.createElement("h2");
                    titleElement.textContent = post.title;
                    titleElement.className += " scrollH";
                    postElement.appendChild(titleElement);

                    let textElement = document.createElement("p");
                    textElement.className += " scroll";
                    textElement.textContent = post.text;
                    postElement.appendChild(textElement);
                    postElement.dataset.postId = post._id;

                    let row = document.createElement("div")
                    row.className += " space-around"

                    let regards = document.createElement("p")
                    regards.className += " regards"
                    regards.textContent = "Regards! Muhammad Ahad"
                    row.appendChild(regards)

                    let edit = document.createElement("i");
                    edit.className += " regards bi bi-pencil-fill";
                    edit.addEventListener("click", function(event) {
                        event.preventDefault();
                        let postId = this.parentNode.parentNode.dataset.postId;
                        // console.log(postId)
                        editPost(postId);
                    });
                    row.appendChild(edit);


                    let del = document.createElement("i")
                    del.className += " regards bi bi-trash-fill"
                    del.addEventListener("click", function(event) {
                        event.preventDefault();
                        let postId = this.parentNode.parentNode.dataset.postId;
                        deletePost(postId);
                    });
                    row.appendChild(del)
                    postElement.appendChild(row)

                    postContainer.appendChild(postElement);

                })
            };
        })
        .catch(function(error) {
            // console.log(error.data);
        });
}

// delete post function

function deletePost(postId) {
    Swal.fire({
        title: 'Enter Password',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        cancelButtonColor: "#24232c",
        confirmButtonText: 'Delete',
        confirmButtonColor: "#24232c",
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
            if (password === '12345') {

                return axios.delete(`/api/v1/post/${postId}`)
                    .then(response => {
                        // console.log(response.data);
                        Swal.fire({
                            icon: 'success',
                            title: 'Post Deleted',
                            timer: 1000,
                            showConfirmButton: false
                        });

                        renderPost();
                    })
                    .catch(error => {
                        // console.log(error.data);
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed to delete post',
                            showConfirmButton: false
                        });
                    });
            } else {

                return Swal.fire({
                    icon: 'error',
                    title: 'Invalid Password',
                    text: 'Please enter correct password',
                    timer: 1000,
                    showConfirmButton: false
                });
            }
        }
    });
}

// edit post

function editPost(postId) {
    Swal.fire({
        title: 'Enter Password',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        cancelButtonColor: "#24232c",
        confirmButtonText: 'Edit',
        confirmButtonColor: "#24232c",
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
            if (password === '12345') {

                axios.get(`/api/v1/post/${postId}`)
                    .then(response => {
                        const post = response.data;

                        Swal.fire({
                            title: 'Edit Post',
                            html: `
                  <input type="text" id="editTitle" class="swal2-input" placeholder="Post Title" value="${post.title}" required>
                  <textarea id="editText" class="swal2-input text" placeholder="Post Text" required>${post.text}</textarea>
                `,
                            showCancelButton: true,
                            cancelButtonColor: "#24232c",
                            confirmButtonText: 'Update',
                            confirmButtonColor: "#24232c",
                            preConfirm: () => {

                                const editedTitle = document.getElementById('editTitle').value;
                                const editedText = document.getElementById('editText').value;

                                if (!editedTitle.trim() || !editedText.trim()) {
                                    Swal.showValidationMessage('Title and text are required');
                                    return false;
                                }

                                return axios.put(`/api/v1/post/${postId}`, {
                                        title: editedTitle,
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
                                        renderPost()
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
            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Password',
                    text: 'Please enter correct password',
                    showConfirmButton: false
                });
            }
        }
    });
}

// delete all

function deleteAllPosts() {
    Swal.fire({
        title: 'Enter Password',
        input: 'password',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        cancelButtonColor: "#24232c",
        confirmButtonText: 'Delete All Posts',
        confirmButtonColor: "#24232c",
        showLoaderOnConfirm: true,
        preConfirm: (password) => {
            if (password === '12345') {
                return axios.delete(`/api/v1/posts/all`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        data: {
                            password: password
                        }
                    })
                    .then(response => {
                        // console.log(response.data);
                        Swal.fire({
                            icon: 'success',
                            title: 'All Posts Deleted',
                            timer: 1000,
                            showConfirmButton: false
                        });
                        renderPost();
                    })
                    .catch(error => {
                        // console.log(error.data);
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed to delete all posts',
                            showConfirmButton: false
                        });
                    });
            } else {
                return Swal.fire({
                    icon: 'error',
                    title: 'Invalid Password',
                    text: 'Please enter correct password',
                    timer: 1000,
                    showConfirmButton: false
                });
            }
        }
    });
}

// logout

function logout(event) {
    event.preventDefault();
    axios.post(`/api/v1/logout`, {})
        .then(function(response) {
            Swal.fire({
                icon: 'success',
                title: 'Logout Successfully',
                timer: 1000,
                showConfirmButton: false
            });
            window.location.pathname = "/login"
        })
        .catch(function(error) {
            Swal.fire({
                icon: 'error',
                title: "Can't logout",
                timer: 1000,
                showConfirmButton: false
            });
        });
}

// refresh page

document.addEventListener("DOMContentLoaded", function() {
    renderPost();
});