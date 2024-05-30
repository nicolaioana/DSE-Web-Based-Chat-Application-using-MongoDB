import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const ChatroomPage = ({ socket }) => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const messageRef = useRef();

    const sendMessage = () => {
        if (socket && socket.emit && messageRef.current.value.trim()) {
            socket.emit("chatroomMessage", {
                chatroomId: id,
                message: messageRef.current.value,
            });
            messageRef.current.value = ''; // Clear input after sending message
        } else {
            console.error('Socket is not properly initialized.');
        }
    };

    useEffect(() => {
        if (socket) {
            // Join the chatroom
            socket.emit("joinRoom", {
                chatroomId: id,
            });

            // Handle incoming messages
            socket.on('message', (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            socket.on("newMessage", (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });
        }

        // Cleanup on component unmount
        return () => {
            if (socket) {
                socket.emit("leaveRoom", {
                    chatroomId: id,
                });
            }
            // Remove the message listeners
            socket.off('message');
            socket.off('newMessage');
        };
    }, [id, socket]);

    return (
        <div className='chatroomPage'>
            <div>ChatroomPage {id}</div>
            <div className='chatroomSection'>
                <div className='cardHeader'>Chatroom Name</div>
                <div className='chatroomContent'>
                    {messages.map((message) => (
                        <div key={message.id} className='message'>
                            <span className="otherMessage">{message.name}:</span> {message.message}
                        </div>
                    ))}
                </div>
                <div className='chatroomActions'>
                    <div>
                        <input
                            type="text"
                            name="message"
                            placeholder='Say something'
                            ref={messageRef}
                        />
                    </div>
                    <div>
                        <button className='join' onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatroomPage;
