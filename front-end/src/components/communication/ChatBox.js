// front-end/src/components/communication/ChatBox.js
import { useEffect, useState } from 'react';
import { API_ENDPOINTS, NAME_CONFIG } from '../../config';
import socket from '../../socket';
import { useParams } from 'react-router-dom';



function ChatBox({ currentUserId }) {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        // Fetch existing messages
        const fetchMessages = async () => {
            try {
                const res = await fetch(`${API_ENDPOINTS.GET_MESSAGES}/${conversationId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(NAME_CONFIG.TOKEN)}`
                    }
                });
                const data = await res.json();
                setMessages(data);
            } catch (err) {
                console.error('Failed to load messages', err);
            }
        };

        fetchMessages();

        // Join socket room
        socket.emit('join_conversation', conversationId);

        // Listen for new messages
        socket.on('receive_message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off('receive_message');
        };
    }, [conversationId]);


    const sendMessage = () => {
        const messageData = {
            conversationId,
            senderId: currentUserId,
            text,
        };
        socket.emit('send_message', messageData);
        setText('');
    };


    return (
        <div>
            <div>
                {messages.map((m, i) => (
                    <p key={i}><b>{m.senderId === currentUserId ? 'You' : 'Them'}:</b> {m.text}</p>
                ))}
            </div>
            <input value={text} onChange={(e) => setText(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default ChatBox;