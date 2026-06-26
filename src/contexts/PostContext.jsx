import { useState, useContext, createContext } from "react";

const PostContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = "http://localhost:3000";

  const fetchPostsByUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${BASE_URL}/posts/user/${userId}`);
      if (!response.ok) {
        throw new Error("Error fetching posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (postContent) => {
    const token = localStorage.getItem("authToken");
    const decode = jwtDecode(token);
    const userId = decode.id;

    const data = {
      title: "Post Title",
      content: postContent,
      user_id: userId,
    };

    const response = await axios.post(`${BASE_URL}/posts`, data);

    setPosts((prevPosts) => [response.data, ...prevPosts]);
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPostsByUser,
        savePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostContext);
}
