import React from "react";
import Login from "./Components/Login";
import Register from "./Components/Register";
import EmailVerify from "./Components/EmailVerify";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Post from "./Components/Post";
import AllPosts from "./Components/AllPosts";
import Answers from "./Components/Answers";


import {BrowserRouter, Routes, Route} from "react-router-dom";

//Import use context to allow u_email to be used on all pages
import { UserContext } from "./Components/UserContext";
//
import { useState } from "react";
import { useEffect } from "react";

function App() {

  ////Allowing the data inside send_u_email_everywhere and send_u_name_everywhere to persist every time a page reloads and will then be able to pass it to different components.
  const [send_u_email_everywhere, setSendUEmailEvery] = useState("");
  const [send_u_name_everywhere, setSendUNameEvery] = useState("");

  useEffect(function(){
          const data = window.localStorage.getItem("send_u_email_everywhere");
          if(data){
              setSendUEmailEvery(data);
          }
      },[])
  
  useEffect(function(){
      window.localStorage.setItem("send_u_email_everywhere", send_u_email_everywhere);
  },[send_u_email_everywhere]);


  useEffect(function(){
      const data = window.localStorage.getItem("send_u_name_everywhere");
      if(data){
          setSendUNameEvery(data);
      }
  },[])
  
  useEffect(function(){
      window.localStorage.setItem("send_u_name_everywhere", send_u_name_everywhere);
  },[send_u_name_everywhere]);
    ////Allowing the data inside send_u_email_everywhere to persist every time a page reloads and will then be able to pass it to different components.



  return (
     <BrowserRouter>

      <Routes>
        <Route path={"/"} element={<Register/>}/>
        <Route path="/verify-email/:token" element={<EmailVerify />} />
      </Routes>

      <UserContext.Provider value={{send_u_email_everywhere, setSendUEmailEvery, send_u_name_everywhere, setSendUNameEvery}}>
          <Routes>
                  <Route path={"/login"} element={<Login/>}/>
                  <Route path={"/home"} element={<Home/>}/>
                  <Route path={"/post"} element={<Post/>}/>
                  <Route path={"/allposts"} element={<AllPosts/>}/>
                  <Route path={"/answers"} element={<Answers/>}/>
          </Routes>
      </UserContext.Provider>    

            
      </BrowserRouter>
  );
}

export default App;
