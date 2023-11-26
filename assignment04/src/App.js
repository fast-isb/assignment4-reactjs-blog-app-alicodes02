import './App.css';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Blog from './components/Blog';
import axios from 'axios';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  

  const fetchAllBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/all-blogs');
      setBlogs(response.data.blogs);
      console.log('Fetched All the Blogs Successfully!');
    } catch (error) {
      alert('Error Fetching Blogs');
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div>
      <Navbar />
      <div className="blogs">
        {blogs.map((blog) => (
          <Blog key={blog._id}
          id={blog._id}
          title={blog.title}
          content={blog.content}
          ownerName={blog.ownerName}
          comments={blog.comments || []}
          ratings={blog.ratings} />
        ))}
      </div>
    </div>
  );
}

export default App;
