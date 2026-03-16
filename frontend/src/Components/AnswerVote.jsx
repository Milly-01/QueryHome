import React from "react";
import { useState } from "react";

import axios from "axios";

import Swal from "sweetalert2";


import { useContext } from "react";
import { UserContext } from "./UserContext";

import "./AnswerVote.css";


function AnswerVote({answerId, refreshAnswerData}){


    const {send_u_email_everywhere, setSendUEmailEvery} = useContext(UserContext);
    const {send_u_name_everywhere, setSendUNameEvery} = useContext(UserContext);



    async function handleUpVote(){

        const voteType = 1;

        try {

            const response = await axios.post("http://localhost:5000/vote-answer", {answerId, send_u_email_everywhere, voteType});
            console.log(response);
           
            if (response.data.message === "Vote added") {
                                
                Swal.fire(
                'Voted!',
                `Like added`,
                'success'
                )

                
            }else if(response.data.message === "Vote removed"){
                 Swal.fire(
                'Voted!',
                `Like removed`,
                'success'
                )
            }else if(response.data.message === "Vote updated"){
                  Swal.fire(
                'Voted!',
                `Vote updated from dislike to like`,
                'success'
                )
            }

            refreshAnswerData();

        } catch (error) {
        console.error(error);
        }


    }


    async function handleDownVote(){
        const voteType = -1;

        try{
            const response = await axios.post("http://localhost:5000/vote-answer",{answerId, send_u_email_everywhere, voteType});
                console.log("Vote submitted");

                if (response.data.message === "Vote added") {
                                
                Swal.fire(
                'Voted!',
                `"Dislike added`,
                'success'
                )
            }else if(response.data.message === "Vote removed"){
                 Swal.fire(
                'Voted!',
                `Dislike removed`,
                'success'
                )
            }else if(response.data.message === "Vote updated"){
                  Swal.fire(
                'Voted!',
                `Vote update from like to dislike`,
                'success'
                )
            }

              refreshAnswerData();

        }catch (error){
                console.error(error);
        }
    }

    

    return(
        <div>
          
            <div className="my-vote-buttons">
                <button onClick={handleUpVote} className="like-btn">Like</button>
                 <button onClick={handleDownVote} className="dislike-btn">Dislike</button>
            </div>
            
        </div>
    );
}

export default AnswerVote;