import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function EmailVerify(){

  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying email...");

  useEffect(()=>{

    async function verify(){

      try{

        const res = await axios.get(
          `http://localhost:5000/verify/${token}`
        );

        if(res.data.success){

          setMessage("✅ Email verified successfully!");

          setTimeout(()=>{
            navigate("/login");
          },3000);

        }

      }catch(err){

        if(err.response){
          setMessage(err.response.data.error);
        }else{
          setMessage("Verification failed");
        }

      }

    }

    verify();

  },[token,navigate]);

  return(

    <div style={{textAlign:"center", marginTop:"100px"}}>

      <h2>{message}</h2>

    </div>

  );

}

export default EmailVerify;