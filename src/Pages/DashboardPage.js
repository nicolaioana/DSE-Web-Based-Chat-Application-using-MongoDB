import React from 'react';
import axios from "axios";
import { Link } from "react-router-dom";

const DashboardPage = (props) => {
    const [chatrooms, setChatrooms] = React.useState([]);

    const getChatrooms = () => {
        axios.get("http://localhost:8000/chatroom", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("CC_Token"),
            },
        }).then(response => {
            setChatrooms(response.data);
        }).catch(err => {
            setTimeout(getChatrooms, 3000); 
        });
    };

    React.useEffect(() => {
        getChatrooms();

        if (props.socket) {
            props.socket.on('someEvent', (data) => {
                // Handle socket event
                console.log(data);
            });
        }

        // Cleanup socket event listener on component unmount
        return () => {
            if (props.socket) {
                props.socket.off('someEvent');
            }
        };
        // eslint-disable-next-line
    }, []);

    return (
        <div className="card">
            <div className="cardHeader">Chatrooms</div>
            <div className="cardBody">
                <div className='inputGroup'>
                    <label htmlFor='chatroomName'>Chatroom Name</label>
                    <input 
                        type="text" 
                        name="chatroomName" 
                        id="chatroomName" 
                        placeholder="Your chatroom name"
                    />
                </div>
                <button>Create Chatroom</button>
                <div className='chatrooms'>
                    {chatrooms.map((chatroom) => (
                        <div key={chatroom._id} className='chatroom'>
                            <div>{chatroom.name}</div>
                            <Link to={`/chatroom/${chatroom._id}`}>
                                <div className='join'>Join</div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
