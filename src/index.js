// When the page loads, run displayPosts
window.addEventListener("DOMContentLoaded", displayPosts);

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
      postList.innerHTML = ""; // clear existing list

      posts.forEach((post) => {
        const li = document.createElement("li");
        li.className =
          "cursor-pointer hover:bg-red-100 rounded p-2 flex items-center space-x-2";

        li.innerHTML = `
          <span class="font-medium text-gray-800">${post.title}</span>
        `;

        // Optional: Add click listener to show full post on center panel
        li.addEventListener("click", () => displayPostDetails(post));

        postList.appendChild(li);
      });
    })
    .catch((err) => console.error("Error loading posts:", err));
}

// Show post in center panel
function displayPostDetails(post) {
  document.getElementById("detailTitle").textContent = post.title;
  document.getElementById("detailBody").textContent = post.body;

  const img = document.getElementById("detailImage");
  img.src = post.image;
  img.alt = post.title;
  img.classList.remove("hidden");
}
