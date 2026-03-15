//Imports
import React, {useContext, useState} from "react";
//Importing Login CSS Styles
import "./Login.css";
//
//Use Navigate and Link to be used to navigate to different routes and pass data
import {Link, useNavigate} from "react-router-dom";
//
//Library for making http requests
import axios from "axios";
//
//Swal Library for alerts
import Swal from "sweetalert2";
//
//Importing user context to allow me to pass data across many routes/everywhere
import { UserContext } from "./UserContext";
//

function Login(){

    //use state variable to capture email and password
    const [u_email, setEmail] = useState("");
    const [u_password, setPassword] = useState("");
    const [u_name, setName] = useState("");
    //

    //need to pass email everywhere because it will be the unique identifer being used and also to keep users logged in even when user clicks refresh
    const {send_u_email_everywhere, setSendUEmailEvery} = useContext(UserContext);
    const {send_u_name_everywhere, setSendUNameEvery} = useContext(UserContext);
    //


    const navigate = useNavigate();

    function handleName(event){
        setName(event.target.value);
        setSendUNameEvery(event.target.value);////Will be able to use context for this Email value on any page
    }

    function handleEmail(event){
        setEmail(event.target.value);
        setSendUEmailEvery(event.target.value); //Will be able to use context for this Email value on any page
    }

    function handlePassword(event){
        setPassword(event.target.value);
    }

    async function handleSubmitLoginForm(event){
        event.preventDefault();
        try{
            const res = await axios.post(`http://localhost:5000/login`,{u_name,u_email,u_password});

         Swal.fire(
            'Login!',
            `${res.data.message}`,
            'success'
        )

        navigate("/home");
         }catch(err){


        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `${err.response.data.error}`,
        })  

        //alert(err.response.data.error);

            // if(err.response){
            //     setMessage(err.response.data.error);
            // }else{
            //     setMessage("Server error");
            // }

    }
    }




    
    return(
        <div className="login-me">
            <div className="row">
                <div className="col-sm-3 col-md-4"></div>
                <div className="col-sm-6 col-md-4">
                    <div className="my-box">
                        <form onSubmit={handleSubmitLoginForm}>
                            <h1 className="heading-login">Login</h1>
                            <input required className="my-inputs" type="text" placeholder="Name" onChange={handleName} value={u_name}></input>
                            <input required className="my-inputs" type="email" placeholder="Email Address" onChange={handleEmail} value={u_email}></input>
                            <input required className="my-inputs" type="password" placeholder="Password" onChange={handlePassword} value={u_password}></input>
                            <button type="submit" className="submit-login">Submit</button>
                        </form>
                       <Link to={"/"} className="link-register">Don't have an account? Register.</Link>
                    </div>

                </div>
                <div className="col-sm-3 col-md-4"></div>
            </div>
            
        </div>
    );

}

export default Login;