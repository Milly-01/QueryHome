import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

import "./Answers.css";

import { UserContext } from "./UserContext";
import { useContext } from "react";

import axios from "axios";

import Swal from "sweetalert2";

function Answers(){

    const {send_u_email_everywhere, setSendUEmailEvery} = useContext(UserContext);
    const {send_u_name_everywhere, setSendUNameEvery} = useContext(UserContext);

    const [answers, setAnswers] = useState([]);
    const [my_answer, setAnswer] = useState("");

    const location = useLocation();


//  <Link className="style-link" to={"/answers"} state={{question_id:post.id ,question_title: post.title, question_post: post.body, question_email: user_email, question_date: post.created_at, question_name: post.name, question_surname: surname}}>{post.title}</Link>


    const [loc_question_id, setLocQuestionID] = useState("");
    const [loc_question_title, setLocQuestionTitle] = useState("");
    const [loc_question_post, setLocQuestionPost] = useState("");
    const [loc_question_email, setLocQuestionEmail] = useState("");
    const [loc_question_date, setLocQuestionDate] = useState("");
    const [loc_question_name, setLocQuestionName] = useState("");
    const [loc_question_surname, setLocQuestionSurname] = useState("");

       

    //  useEffect(function(){
    //     setLocQuestionID(location.state.id);
    //     setLocQuestionEmail(location.state.user_email);
    //     setLocQuestionTitle(location.state.title);
    //     setLocQuestionPost(location.state.body);
    //     setLocQuestionDate(location.state.created_at);
    //     setLocQuestionName(location.state.name);
    //     setLocQuestionSurname(location.state.surname);

    //     axios.get("/answer")
    //         .then(function(response){
    //             setAnswers(response.data);
    //         })
    // }); 

        useEffect(function(){
              setLocQuestionID(location.state.question_id);
            setLocQuestionEmail(location.state.question_email);
            setLocQuestionTitle(location.state.question_title);
            setLocQuestionPost(location.state.question_post);
            setLocQuestionDate(location.state.question_date);
            setLocQuestionName(location.state.question_name);
            setLocQuestionSurname(location.state.question_surname);

 
        axios.get("http://localhost:5000/answers")
            .then(function(response){
                setAnswers(response.data);
            })
    }); 



    function handleAnswerChange(event){
        setAnswer(event.target.value);
    }


    async function handleSubmitAnswer(event){
    

        event.preventDefault();


        try{
             const response = await axios.post("http://localhost:5000/answer", {loc_question_id, my_answer, send_u_email_everywhere});

            if (response.data.success) {
                    
                Swal.fire(
                'Question Answered!',
                `${response.data.message}`,
                'success'
                )
            }


        }catch(error){
             Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${error.response.data.error}`,
            }) 

        }
       
    }





    /////////////////////anser function
     function answerComponent(answer){
        return(
            <div className="contain-answer2">
                <div className="contain-answer">
                    {send_u_email_everywhere === answer.user_email? <label>Answer By: <div className="you-div">You</div></label>: <label>Answer By: {answer.name} {answer.surname}</label>}
                    <div className="answers-1">
                       <p>{answer.body}</p>
                    </div>

                    <label class="float-us">{answer.created_at}</label>
                    {/* <label class="float-us">{answer.a_date}</label> */}

                
                </div>

            </div>
        );
    };

    //////////////////////////////////////////////////////////////////




    return(
        <div>
            <Navbar/>
            <h1 className="answers-heading">The Question</h1>

            <div className="the-actual-question">
                {loc_question_email === send_u_email_everywhere? <label>Posted By: <div className="you-div">You</div></label> : <label>Posted By: {loc_question_name} {loc_question_surname}</label>}


        
                <h3 className="loc-title">{loc_question_title}</h3>

                <div className="the-actual-actual-question">
                    <p>{loc_question_post}</p>
                </div>
                {/* <button onClick={handleClickUpVote} className="like-buttons"><i class="fa-solid fa-thumbs-up"></i></button> */}
                {/* <button onClick={handleClickDownVote} className="like-buttons"><i class="fa-solid fa-thumbs-down"></i></button> */}
                {/* <button className="like-buttons">{loc_vote}</button> */}
                <label className="post-label">{loc_question_date}</label>
                {/* <label className="post-label">{loc_time}</label> */}
            </div>

            <hr/>

            <h1 className="answers-heading">Answers</h1>

            
                {answers.map(answer => (
                    loc_question_id === answer.question_id?  answerComponent(answer) : null
                ))}
               


         
            




            <div className="answer-div">
                <form onSubmit={handleSubmitAnswer}>
                    <p className="your-answer">Your Answer</p>
                    <textarea onChange={handleAnswerChange} value={my_answer} required className="form-control my-answer-text-area" rows={"15"} placeholder="Answer the question"></textarea>
                    <button className="answer-button" type="submit">Publish</button>
                </form>
             
            </div>



        </div>
    );
}

export default Answers;