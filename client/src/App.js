import React from "react";
import axios from "axios";
import "bulma/css/bulma.css";

function App() {
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    axios
      .get("http://localhost:5000/api/posts")
      .then(data => {
        setPosts(data.data);
      })
      .catch(error => {
        console.log(error.message);
      });
  }, []);
  return (
    <div className="section">
      {posts.map(post => {
        return (
          <div className="card">
            <div className="card-content">
              <h2 className="title">{post.title}</h2>
            </div>
            <p className="subtitle">{post.contents}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;
