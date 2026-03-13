import React from "react";

import Navbar from "./Navbar";

import "./Home.css";


function Home(){

    return(
       
        <div className="my-home">
             <Navbar/>
             <div className="home-headings">
                <h5>Welcome</h5>
                <h6>Overflow your knowledge with, QUERYHOME</h6>
             </div>

            <dl className="dictionary">
                <div className="term">
                    <div className="box-component">
                        <p>View All Posts</p>
                         <i class="fa-solid fa-circle-info f-size"></i>
                    </div>
                </div>
                <div className="term">
                    <div className="box-component">
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