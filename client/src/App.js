import React from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    axios.get('http://localhost:5000/api/posts')
    .then(data => {
      setPosts(data.data);
    })
    .catch(error => {
      console.log(error.message);
    })
  }, [])
  debugger
  return (
    <div className="App">
      {
        posts.map(post => {
          return (
            <div>
              <h2>{post.title}</h2>
              <p>{post.contents}</p>
            </div>
          );
        })
      }
    </div>
  );
}

export default App;
