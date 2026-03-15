import React from "react";

import Navbar from "./Navbar";

import "./Home.css";

import { UserContext } from "./UserContext";
import { useContext } from "react";

import { Link, useNavigate } from "react-router-dom";


function Home(){

    const {send_u_email_everywhere, setSendUEmailEvery} = useContext(UserContext);
    const {send_u_name_everywhere, setSendUNameEvery} = useContext(UserContext);

    const navigate = useNavigate();

    function handlePost(){
        navigate("/post");
    }

    function handleAllPosts(){
        navigate("/allposts");
    }

    return(
       
        <div className="my-home">
             <Navbar/>
             <div className="home-headings">
              <div className="initials">{send_u_name_everywhere.charAt(0)}</div>
                <h5>Welcome {send_u_name_everywhere}</h5>
                <h6>Overflow your knowledge with, QUERYHOME</h6>
             </div>

            <dl className="dictionary">
                <div className="term">
                    <div className="box-component" onClick={handleAllPosts}>
                        <p>View All Posts</p>
                         <i class="fa-solid fa-circle-info f-size"></i>
                    </div>
                </div>
                <div className="term">
                    <div className="box-component" onClick={handlePost}>
                        <p>Compose A Post</p>
                        <i class="fa-solid fa-plus f-size"></i>
                    </div>
                </div>
                <div className="term">
                    <div className="box-component">
                        <p>Manage Your Posts</p>
                        <i class="fa-solid fa-list-check f-size"></i>
                    </div>
                </div>
                <div className="term">
                    <div className="box-component">
                        <p>View Your Profile</p>
                        <i class="fa-solid fa-user f-size"></i>
                    </div>
                </div>
       

            </dl>
           
        </div>
    );
}

export default Home;