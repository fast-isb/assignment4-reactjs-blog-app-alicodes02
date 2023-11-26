import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Blog from './Blog';

const UserHomePage = () => {
  const location = useLocation();
  const { id, name, mail, usertoken } = location.state || {};

  const [open, setOpen] = useState(false);
  const [blogData, setBlogData] = useState({
    title: "",
    content: "",
  });
  const [commentData, setCommentData] = useState({
    comment: "s",
  });
  const [userBlogs, setUserBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [showAllBlogs, setShowAllBlogs] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setBlogData({
      ...blogData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCommentInputChange = (e) => {
    setCommentData({
      ...commentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddBlog = async () => {
    try {
      const newBlog = {
        title: blogData.title,
        content: blogData.content,
      };

      const response = await axios.post('http://localhost:3000/add-blog', newBlog, {
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      });

      console.log('Blog added successfully:', response.data);
      alert('Blog added successfully');
      handleClose();
      if (showAllBlogs) {
        fetchAllBlogs();
      } else {
        fetchUserBlogs();
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('Error creating blog post');
    }
  };

  
  const fetchUserBlogs = async () => {
    try {
      const url = `http://localhost:3000/blogs/${id}`;
      console.log('Fetching user blogs with URL:', url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${usertoken}`,
        },
      });

      setUserBlogs(response.data);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    }
  };

  const fetchAllBlogs = async () => {
    try {
      const url = `http://localhost:3000/all-blogs`;
      console.log('Fetching all blogs with URL:', url);

      const response = await axios.get(url);

      setAllBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error fetching all blogs:', error);
    }
  };

  const handleBlogDelete = () => {
    if (showAllBlogs) {
      fetchAllBlogs();
    } else {
      fetchUserBlogs();
    }
  };

  const toggleShowAllBlogs = () => {
    setShowAllBlogs(!showAllBlogs);
    if (showAllBlogs) {
      fetchUserBlogs();
    } else {
      fetchAllBlogs();
    }
  };

  useEffect(() => {
    console.log("Component mounted with state:", { id, name, mail });
    fetchUserBlogs();
  }, [location.state]);

  return (
    <div>
      <Navbar />

      <div className="user-page-div">
        <h1>User Homepage</h1>
        <p>Username: {name}</p>
        <p>Email: {mail}</p>

        <Button onClick={toggleShowAllBlogs}>
          {showAllBlogs ? "Show Your Blogs" : "Show All Blogs"}
        </Button>

        <div>
          <h2>{showAllBlogs ? "All Blogs" : "Your Blogs"}</h2>
          <ul>
            {showAllBlogs
              ? allBlogs.map((blog) => (
                  <Blog
                  key={blog._id}
                  id={blog._id}
                  title={blog.title}
                  content={blog.content}
                  ownerId = {blog.ownerId}
                  ownerName={blog.ownerName}
                  userId = {id}
                  usertoken={usertoken}
                  onDelete={handleBlogDelete}
                  onEdit={fetchAllBlogs}
                  comments={blog.comments || []}
                  ratings={blog.ratings} 
                  />
                ))
              : userBlogs.map((blog) => (
                  <Blog
                  key={blog._id}
                  id={blog._id}
                  title={blog.title}
                  content={blog.content}
                  ownerId = {blog.ownerId}
                  ownerName={blog.ownerName}
                  userId = {id}
                  usertoken={usertoken}
                  onDelete={handleBlogDelete}
                  onEdit={fetchUserBlogs}
                  comments={blog.comments || []}
                  ratings={blog.ratings} 
                  />
                ))}
          </ul>
        </div>

        <Fab color="primary" aria-label="add" onClick={handleOpen} className="float-add-button">
          <AddIcon />
        </Fab>
      </div>

      {/* Blog Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Blog</DialogTitle>
        <DialogContent>
          <TextField label="Title" name="title" value={blogData.title} onChange={handleInputChange} fullWidth />
          <TextField
            label="Content"
            name="content"
            value={blogData.content}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddBlog} color="primary">
            Add Blog
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserHomePage;
