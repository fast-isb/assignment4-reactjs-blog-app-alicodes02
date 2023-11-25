import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

import Navbar from './components/Navbar';
import Blog from './components/Blog';
import fetchBlogs from './blogService';

function App() {

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {

    const fetchBlogsData = async () => {

      try {
        const blogsData = await fetchBlogs();
        console.log(blogsData);
        setBlogs(blogsData.blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogsData();
  }, []);

  return (

    <div>
      <Navbar/>

      <div className = 'blogs'>

        {blogs.map((blog) => (
          <Blog key={blog.id} title={blog.title} content={blog.content} />
        ))}

      </div>
    </div>
  );
}

export default App;
