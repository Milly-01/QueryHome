import React, {useState} from "react";
import "./Login.css";

import {Link, useNavigate} from "react-router-dom";

import axios from "axios";

import Swal from "sweetalert2";

function Login(){

    const [u_email, setEmail] = useState("");
    const [u_password, setPassword] = useState("");
   // const [message,setMessage] = useState("");

    const navigate = useNavigate();

    function handleEmail(event){
        setEmail(event.target.value);
    }

    function handlePassword(event){
        setPassword(event.target.value);
    }

    async function handleSubmitLoginForm(event){
        event.preventDefault();
        try{
            const res = await axios.post(`http://localhost:5000/login`,{u_email,u_password});

       //  setMessage(res.data.message);
         Swal.fire(
            'Login!',
            `${res.data.message}`,
            'success'
        )
        //  console.log("Logged in user:",res.data.user);
        //  alert("Logged on");
        //  alert(res.data.message);
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
                            <input required className="my-inputs" type="email" placeholder="Email Address" onChange={handleEmail} value={u_email}></input>
                            <input required className="my-inputs" type="password" placeholder="Password" onChange={handlePassword} value={u_password}></input>
                            <button type="submit" className="submit-login">Submit</button>
                        </form>
                       <Link to={"/register"} className="link-register">Don't have an account? Register.</Link>
                    </div>

                </div>
                <div className="col-sm-3 col-md-4"></div>
            </div>
            
        </div>
    );

}

export default Login;