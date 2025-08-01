const delBtn = document.getElementById("deletePostBtn");

function main() {
  // When the page loads, run displayPosts
  window.addEventListener("DOMContentLoaded", displayPosts);
  addNewPostListener();
}

// Fetch and display all blog posts
function displayPosts() {
  fetch("http://localhost:3000/posts")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch posts");
      console.log("Posts fetched successfully");

      return res.json();
    })
    .then((posts) => {
      const postList = document.getElementById("postList");
      postList.innerHTML = "";

      posts.forEach((post) => {
        const li = document.createElement("li");
        li.className =
          "relative cursor-pointer hover:bg-gray-100 p-4 rounded flex items-center space-x-2";

        li.innerHTML = `
          <span class="font-medium text-gray-800">${post.title}</span>
        `;

        // Add click listener to show full post on center panel
        li.addEventListener("click", () => handlePostClick(post));

        postList.appendChild(li);
      });
    })
    .catch((err) => console.error("Error loading posts:", err));
}

// Show post in center panel
function handlePostClick(post) {
  document.getElementById("detailTitle").textContent = post.title;
  document.getElementById("detailBody").textContent = post.body;

  const img = document.getElementById("detailImage");
  img.src = post.image;
  img.alt = post.title;
  img.classList.remove("hidden");

  delBtn.classList.remove("hidden");

  //  Setup delete button here
  handleDeleteButtonClick(post);
}

function addNewPostListener() {
  const toggleBtn = document.getElementById("toggleFormBtn");
  const postForm = document.getElementById("new-post-form");

  // Toggle the visibility of the post form
  toggleBtn.addEventListener("click", () => {
    if (postForm.classList.contains("hidden")) {
      postForm.classList.remove("hidden");
      toggleBtn.textContent = "cancel";
    } else {
      postForm.classList.add("hidden");
      toggleBtn.textContent = "➕ Add Post";
    }
  });

  // Handle form submission
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const image = document.getElementById("image").value;

    if (!title || !body || !image) {
      alert("Please fill in all fields");
      return;
    }

    // Create new post object
    const newPost = {
      title,
      body,
      image,
    };

    // Send POST request to server
    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then((post) => {
        console.log("Post created:", post);
        displayPosts();
        postForm.reset();
        toggleBtn.textContent = "Add New Post";
        postForm.classList.add("hidden");
      })
      .catch((err) => console.error("Error creating post:", err));
  });
}

function handleDeleteButtonClick(post) {
  delBtn.classList.remove("hidden");

  //  Replace old delete button to remove previous listeners
  const freshBtn = delBtn.cloneNode(true);
  delBtn.parentNode.replaceChild(freshBtn, delBtn);

  // Add click listener
  freshBtn.addEventListener("click", function () {
    function deletePostFromServer() {
      if (confirm("Are you sure you want to delete this post?")) {
        fetch(`http://localhost:3000/posts/${post.id}`, {
          method: "DELETE",
        })
          .then(() => {
            displayPosts(); // refresh sidebar
            resetPostDetails(); // clear center view
          })
          .catch((err) => console.error("Delete failed:", err));
      }
    }

    deletePostFromServer();
  });
}

// Optional: reset center panel after deleting
function resetPostDetails() {
  document.getElementById("detailTitle").textContent = "Select a post to read";
  document.getElementById("detailBody").textContent =
    "Post content will appear here...";
  document.getElementById("detailImage").classList.add("hidden");
  delBtn.classList.add("hidden");
}

main();
