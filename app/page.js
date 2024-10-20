"use client";

import { useEffect, useState } from "react";
import { users } from "@/data/data";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteBlogId, setDeleteBlogId] = useState("");
  const [deleteUserId, setDeleteUserId] = useState("");

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBlogs(data.data);
      });
  }, []);

  const openDeleteModal = (blogId) => {
    setDeleteBlogId(blogId);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {

    const blogOwner = deleteUserId;
    let userId;

    switch (blogOwner) {
      case "user1":
        userId = 1;
        break;
      case "user2":
        userId = 2;
        break;
      case "user3":
        userId = 3;
        break;
      case "user4":
        userId = 4;
        break;
      case "user5":
        userId = 5;
        break;
      default:
        break;
    }

      const response = await fetch(
        `/api/blog?blogId=${deleteBlogId}&userId=${userId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("Blog deleted successfully");
        setBlogs((prevBlogs) => {
          const {[deleteBlogId]: _, ...remainingBlogs} = prevBlogs;
          return remainingBlogs;
        });
      } else {
        alert("Unauthorized user");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Error deleting blog");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const openModal = (blogId) => {
    setCurrentBlog({ ...blogs[blogId] });
    setIsModalOpen(true);
  };

  const handleOwnerChange = (event) => {
    setCurrentBlog({ ...currentBlog, owner: event.target.value });
  };

  const handleTitleChange = (event) => {
    setCurrentBlog({ ...currentBlog, title: event.target.value });
  };

  const handleContentChange = (event) => {
    setCurrentBlog({ ...currentBlog, content: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const blogId = currentBlog.id;
    const blogOwner = currentBlog.owner;
    let userId;

    switch (blogOwner) {
      case "user1":
        userId = 1;
        break;
      case "user2":
        userId = 2;
        break;
      case "user3":
        userId = 3;
        break;
      case "user4":
        userId = 4;
        break;
      case "user5":
        userId = 5;
        break;
      default:
        break;
    }

    try {
      const response = await fetch(
        `/api/blog?blogId=${blogId}&userId=${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: currentBlog.title,
            content: currentBlog.content,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Blog updated successfully:", data);
        setBlogs((prevBlogs) => {
          const updatedBlogs = { ...prevBlogs };
          updatedBlogs[blogId] = data.data;
          return updatedBlogs;
        });
        setIsModalOpen(false);
      } else {
        alert(`Unauthorized user`);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Error updating blog");
    }
  };

  return (
    <>
    <img src="/cerbos.png" className="bg-white w-44 m-4 rounded-full overflow-hidden" alt="" />
    <div className=" mx-auto px-4 py-8 flex  flex-wrap gap-10">
      {blogs &&
        Object.keys(blogs).map((key,i) => {
          const user = Object.values(users).find(u => u.name === blogs[key].owner );
          return (
          
          <div
            key={key}
            className=" p-5 w-80 border-[1px] rounded-xl shadow-lg "
          >
            <h1 className="text-2xl font-bold text-green-300">
              {blogs[key].title} ({i+1})
            </h1>
            <p className="mt-2 text-gray-300">{blogs[key].content}</p>
            <p className="mt-4 text-teal-500">Author: {blogs[key].owner} ({user.role})</p> 
            <div className="mt-5 flex justify-end space-x-3">
              <button
                onClick={() => openModal(blogs[key].id)}
                className="bg-cerbosYellow  text-black font-bold py-2 px-4 rounded-full hover:bg-cerbosDarkYellow transition duration-150 ease-in-out"
              >
                Edit Blog
              </button>
              <button
                onClick={() => openDeleteModal(blogs[key].id)}
                className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-150 ease-in-out"
              >
                Delete Blog
              </button>
            </div>
          </div>
        )})}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-black p-6 rounded shadow-md relative"
          >
            <div>
              <label
                htmlFor="owner"
                className="block text-sm font-medium text-gray-200"
              >
                Owner
              </label>
              <select
                id="owner"
                value={currentBlog.owner}
                onChange={handleOwnerChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-slate-900 rounded-md shadow-sm focus:outline-none"
              >
                {["user1", "user2", "user3", "user4", "user5"].map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-200"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={currentBlog.title}
                onChange={handleTitleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-slate-900 rounded-md shadow-sm"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-200"
              >
                Content
              </label>
              <textarea
                id="content"
                rows="3"
                value={currentBlog.content}
                onChange={handleContentChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-slate-900 rounded-md shadow-sm"
              ></textarea>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className=" text-white text-3xl py-2 px-4 duration-150 ease-in-out absolute top-0 right-2"
              >
                &times;
              </button>
              <button
                type="submit"
                className="bg-cerbosYellow text-white py-2 px-4 rounded hover:bg-cerbosDarkYellow transition duration-150 ease-in-out"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-black p-6 rounded shadow-md relative pt-10">
            <h3 className="text-lg font-medium">Who is deleting this blog?</h3>
            <select
              value={deleteUserId}
              onChange={(e) => setDeleteUserId(e.target.value)}
              className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-black rounded-md shadow-sm focus:outline-none"
            >
              <option value="">Select User</option>
              <option value="user1">User 1</option>
              <option value="user2">User 2</option>
              <option value="user3">User 3</option>
              <option value="user4">User 4</option>
              <option value="user5">User 5</option>
            </select>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-white py-2 px-4 rounded text-3xl absolute top-0 right-2"
              >
                &times;
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete Blog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );

};

export default Home;
