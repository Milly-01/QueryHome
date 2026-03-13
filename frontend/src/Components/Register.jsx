import React from "react";
import "./Register.css";

import {Link} from "react-router-dom";
import {useState} from "react";




function Register(){
    
    const [u_email, setEmail] = useState("");
    const [u_password, setPassword] = useState("");
    const [u_name, setName] = useState("");
    const [u_surname, setSurname] = useState("");

    function handleEmail(event){
        setEmail(event.target.value);
    }

    function handlePassword(event){
        setPassword(event.target.value);
    }

    function handleSurname(event){
        setSurname(event.target.value);
    }

    function handleName(event){
        setName(event.target.value);
    }


    function handleSubmitRegisterForm(event){
        event.preventDefault();
        alert(u_name);
        alert(u_surname);
    }

    

    return(
        <div className="register-me">
            <div className="row">
                <div className="col-sm-3 col-md-4"></div>
                <div className="col-sm-6 col-md-4">
                    <div className="my-box">
                        <form onSubmit={handleSubmitRegisterForm}>
                            <h1 className="heading-register">Register An Account</h1>
                            <input required className="my-inputs" type="text" placeholder="Name" onChange={handleName} value={u_name}></input>
                            <input required className="my-inputs" type="text" placeholder="Surname" onChange={handleSurname} value={u_surname}></input>
                            <input required className="my-inputs" type="email" placeholder="Email Address" onChange={handleEmail} value={u_email}></input>
                            <input required className="my-inputs" type="password" placeholder="Password" onChange={handlePassword} value={u_password}></input>
                            <button type="submit" className="submit-register">Submit</button>
                        </form>
                        {/* <Link to={"/login"} className="link-login">Already have an account? Login.</Link> */}
                    </div>

                </div>
                <div className="col-sm-3 col-md-4"></div>
            </div>
            
        </div>
    );

}

export default Register;