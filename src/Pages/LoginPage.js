import React from 'react';
import makeToast from '../Toaster';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const LoginPage = () => {
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    let navigate = useNavigate();
   
    const loginUser = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        axios
            .post("http://localhost:8000/user/login", {
                email,
                password,
            })
            .then((response) => {
                makeToast("success", response.data.message);
                localStorage.setItem("CC_Token", response.data.token); // Assuming response.data.token contains the token
                console.log(response.data);
                navigate("/dashboard");

                // Setup socket connection after successful login
                const socket = io("http://localhost:8000", {
                    query: {
                        token: response.data.token,
                    },
                });

                // Example function to handle socket connection
                socket.on('connect', () => {
                    console.log('Socket connected');
                });

            })
            .catch((err) => {
                makeToast("error", err.response.data.message);
            });
    };

    return (
        <div className="card">
            <div className="cardHeader">Login</div>
            <div className="cardBody">
                <div className='inputGroup'>
                    <label htmlFor='email'>Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="abc@example.com"
                        ref={emailRef}
                    />
                </div>
                <div className='inputGroup'>
                    <label htmlFor='password'>Password</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="Your password"
                        ref={passwordRef}
                    />
                </div>
                <button onClick={loginUser}>Login</button>
            </div>
        </div>
    );
};

export default LoginPage;
