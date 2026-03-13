import React from "react";
import Navbar from "./Navbar";
import { useState } from "react";
import "./Post.css";

function Post(){


    const [u_title, setTitle] = useState(""); 
    const [u_post, setPost] = useState("");
    const [u_email, setEmail] = useState("");
    const [u_date, setDate] = useState("");
    const [u_time, setTime] = useState("");
    const [u_vote, setVote] = useState(0);
    const [u_file, setFile] = useState(null);



    function handleTitle(event){
        setTitle(event.target.value);

        var today = new Date();
        var options = {
            weekday: "long",
            day: "numeric",
            month: "long"
        }
        var day = today.toLocaleDateString("en-US", options);
        setDate(day);
    
        var now = today.toLocaleTimeString();
        setTime(now);

       // setEmail(u_send_everywhere);
        // setEmail(location.state.current_user_email);
        // //////////////////////////////
    }

    function handlePost(event){
        setPost(event.target.value);
    }




    function handleSubmitComposePost(event){
        event.preventDefault();
    }


    return(
        <div>
            <Navbar/>
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