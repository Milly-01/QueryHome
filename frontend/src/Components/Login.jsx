import React, {useState} from "react";
import "./Login.css";

import {Link} from "react-router-dom";

function Login(){

    const [u_email, setEmail] = useState("");
    const [u_password, setPassword] = useState("");

    function handleEmail(event){
        setEmail(event.target.value);
    }

    function handlePassword(event){
        setPassword(event.target.value);
    }

    function handleSubmitLoginForm(event){
        event.preventDefault();
        alert(u_email);
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
                        {/* <Link to={"/register"} className="link-register">Don't have an account? Register.</Link> */}
                    </div>

                </div>
                <div className="col-sm-3 col-md-4"></div>
            </div>
            
        </div>
    );

}

export default Login;