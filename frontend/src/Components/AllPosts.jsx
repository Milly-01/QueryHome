import React, { useEffect, useState } from "react";


import axios from "axios";
import Navbar from "./Navbar";
import "./AllPosts.css";
import { useContext } from "react";
import { UserContext } from "./UserContext";

import { Link } from "react-router-dom";

function AllPosts(){

    const [posts, setPosts] = useState([]);
    const {send_u_email_everywhere, setSendUEmailEvery} = useContext(UserContext);
    const {send_u_name_everywhere, setSendUNameEvery} = useContext(UserContext);



    useEffect(function(){
        axios.get("http://localhost:5000/allposts")
            .then(function(response){
                setPosts(response.data);
             
                console.log(response.data);

            })
    }, []);
       

    return(
        <div>
            <Navbar/>
            <div className="initials">{send_u_name_everywhere.charAt(0)}</div>
            <h1 className="questions-heading">All Questions</h1>
            {
                posts.map( post => (
                    <div className="all-posts">
                         <p className="post-title">
                         <Link className="style-link" to={"/answers"} state={{question_id:post.id ,question_title: post.title, question_post: post.body, question_email: post.user_email, question_date: post.created_at, question_name: post.name, question_surname: post.surname}}>{post.title}</Link>
                         </p>
                         {/* <p>{post.u_post.substring(0, 100) + "..."}</p> */}
                         <p>{post.body}</p>
                         
                         
                         {/* {u_send_everywhere_votes === "" ?  <p>{post.p_vote} votes</p> :  <p>{u_send_everywhere} votes</p> } */}
                        
                         {/* <p>{post.p_vote} votes</p>  */}
                         <div className="date-time">
                            {send_u_email_everywhere === post.user_email?  <label>Posted by: <div className="you-div">You</div></label>:   <label>Posted by: <div className="others-div">{post.name + " " + post.surname}</div></label>}


                            <label class="float-me">{post.created_at}</label>
                            {/* <label class="float-me l">{post.p_time}</label> */}
                           
                         </div>
                       
                        
                         
                         <hr/>


                    </div>
                  
                ))
            }
            
          
         
      

        </div>
       
    );
}

export default AllPosts;