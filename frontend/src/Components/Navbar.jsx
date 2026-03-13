import React from "react";

import {Link} from "react-router-dom";

import "./Navbar.css";

function Navbar(){
    return(
        <div>
            <nav className="navbar navbar-expand-lg nav-color">
                <div className="container-fluid">
                     <label class="brand-style">QUERYHOME</label>
                     <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                         <span class="navbar-toggler-icon toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                         <ul className="navbar-nav ms-auto">
                         <li class="nav-item">
                            {/* <Link class="nav-link my-links" to={"/home"}><i class="fa-solid fa-house"></i> Home</Link> */}
                        </li>
                        <li class="nav-item">
                            {/* <Link class="nav-link my-links" to={"/register"}><i class="fa-solid fa-right-from-bracket"></i> logout</Link> */}
                        </li>
                         </ul>

                    </div>

                </div>

            </nav>
        </div>
    );
}

export default Navbar;