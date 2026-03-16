import React from "react";
import Navbar from "./Navbar";
import { useState } from "react";
import "./Post.css";

import { useContext } from "react";
import { UserContext } from "./UserContext";

import Swal from "sweetalert2";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function Post(){


    const [u_title, setTitle] = useState(""); 
    const [u_post, setPost] = useState("");
    const [u_email, setEmail] = useState("");

    const {send_u_email_everywhere, setSendUEmailEvery} = useContext(UserContext);
    const {send_u_name_everywhere, setSendUNameEvery} = useContext(UserContext);


    const navigate = useNavigate();





    function handleTitle(event){
        setTitle(event.target.value);
        setEmail(send_u_email_everywhere);
    }

    function handlePost(event){
        setPost(event.target.value);
    }

    async function handleSubmitComposePost(event){
    event.preventDefault();

    try {

      const response = await axios.post("http://localhost:5000/post",{u_title, u_post, u_email});

      if (response.data.success) {
        
        Swal.fire(
        'Question Posted!',
        `${response.data.message}`,
        'success'
         )
      }

    } catch (error) {

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${error.response.data.error}`,
        }) 

    //   if (error.response) {
    //     alert(error.response.data.message);
    //   } else {
    //     alert("Server error");
    //   }

    }

    navigate("/allposts");

  };


    return(
        <div>
            <Navbar/>
            <div className="initials">{send_u_name_everywhere.charAt(0)}</div>
            <div className="margin-me">
                <h1>Ask a Question</h1>
                <form onSubmit={handleSubmitComposePost}>
                    <div className="form-group">
                        <label className="my-titles">Title</label>
                        <input required className="form-control" type="text" value={u_title} onChange={handleTitle}/>
                        <label className="my-titles">Post</label>
                        <textarea required className="form-control" rows="10" cols="30" placeholder="Ask a question" value={u_post} onChange={handlePost}></textarea>
            
                               
                    </div>
                    <button className="btn-publish" type="submit" >Publish</button>
                </form>
           
            </div>
            
        </div>
    );
}

export default Post;