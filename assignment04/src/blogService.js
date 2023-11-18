const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:3000/all-blogs');
      const data = await response.json();

      const blogsArray = data.blogs;

      return { blogs: blogsArray };
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  };
  
  export default fetchBlogs;
  