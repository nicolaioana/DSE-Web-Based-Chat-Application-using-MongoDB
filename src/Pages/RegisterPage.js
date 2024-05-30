import React from 'react';
import axios from 'axios';
import makeToast from '../Toaster';
import { useNavigate } from 'react-router-dom';

const RegisterPage = (props) => {
    const nameRef = React.createRef();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    let navigate = useNavigate();

    const registerUser = ()=>{
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const startTime = Date.now();

        axios
         .post("http://localhost:8000/user/register", {
            name,
            email,
            password,
          })
          .then((response) => {
            const endTime = Date.now(); 
    const duration = endTime - startTime;
    console.log(`Request took ${duration} milliseconds to execute`);
            console.log(response.data);
            makeToast("success", response.data.message);
            navigate("/login");
         })
          .catch((err) => {
            console.log("Eroareaaaa este " + err);
           makeToast("error", err.response.data.message);
          });
    };

    return <div className="card">
    <div className="cardHeader">Registration</div>
    <div className="cardBody">
    <div className='inputGroup'>
            <label htmlFor='name'>Name</label>
            <input 
            type="text" 
            name="name" 
            id="name" 
            placeholder="Your name"
            ref={nameRef}/>
        </div>
        <div className='inputGroup'>
            <label htmlFor='email'>Email</label>
            <input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="abc@example.com"
            ref={emailRef}/>
        </div>
        <div className='inputGroup'>
            <label htmlFor='password'>Password</label>
            <input 
            type="password" 
            name="password" 
            id="password" 
            placeholder="Your password"
            ref={passwordRef}/>
            
        </div>
        <button onClick={registerUser}>Register</button>
    </div>

    </div>;
};

export default RegisterPage;