import React from "react";
import Login from "./Components/Login";
import Register from "./Components/Register";
import EmailVerify from "./Components/EmailVerify";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Post from "./Components/Post";


import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
     <BrowserRouter>

      <Routes>
        <Route path={"/"} element={<Register/>}/>
         <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<EmailVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
            {/* <Routes>
                <Route path={"/"} element={<Register/>}/>
                <Route path={"/register"} element={<Register/>}/>
            </Routes> */}


            {/* <UserContext.Provider value={{u_send_everywhere, setSendEverywhere, vote_send_everywhere, setSendVoteEverywhere}}>
                <Routes>
                        <Route path={"/login"} element={<Login/>}/>
                        <Route path={"/home"} element={<Home/>}/>
                        <Route path={"/compose"} element={<Compose/>}/>
                        <Route path={"/profile"} element={<Profile/>}/>
\
                        <Route path={"/allposts"} element={<AllPosts/>}/>
                        <Route path={"/post"} element={<Post/>}/>
                        <Route path={"/manageposts"} element={<ManagePosts/>}/>
                </Routes>
            </UserContext.Provider>     */}

            
      </BrowserRouter>
  );
}

export default App;
