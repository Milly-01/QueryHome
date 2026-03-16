import React, { useEffect, useState } from "react";
import "./ManageMyPosts.css";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";
import Navbar from "./Navbar";

import { Link } from "react-router-dom";

function ManageMyPosts(){
  const [posts, setPosts] = useState([]);
    const {send_u_email_everywhere, setSendUEmailEvery} = useContext(UserContext);
    const {send_u_name_everywhere, setSendUNameEvery} = useContext(UserContext);

  useEffect(function(){
    axios.post("http://localhost:5000/manageposts", {send_u_email_everywhere})
      .then(function(response){
          setPosts(response.data);
          console.log(response.data);
      })
  }, []);

  return (
    <div className="dashboard-container">
    <Navbar/>
    <div className="initials">{send_u_name_everywhere.charAt(0)}</div>
      <h1 className="dashboard-title">My Posts</h1>

      {posts.map((post) => (
        <div key={post.post_ID} className="post-card">
          <div className="post-header">
            <h2>{post.post_title}</h2>
            <span className="post-date">{new Date(post.post_created_at).toLocaleString()}</span>
          </div>
          <p className="post-body">{post.post_body}</p>
          <div className="post-meta">
            <span>Author: {post.author_name} {post.author_surname}</span>
            <span>Total Answers: {post.total_answers}</span>
          </div>

          <div className="answers-container">
            {post.answers?.map((answer) => (
              <div key={answer.answer_ID} className="answer-card">
                <p className="answer-body">{answer.answer_body}</p>
                <div className="answer-meta">
                  <div className={`vote ${answer.user_vote === 1 ? "liked" : ""}`}>
                    👍 {answer.total_likes}
                  </div>
                  <div className={`vote ${answer.user_vote === -1 ? "disliked" : ""}`}>
                    👎 {answer.total_dislikes}
                  </div>
                  <div className="answer-author">
                    by {answer.answer_author_email} at {new Date(answer.answer_created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageMyPosts;