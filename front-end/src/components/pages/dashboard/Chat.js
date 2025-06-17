// front-end/src/components/pages/dashboard/Chat.js
// ...existing code...
import { useEffect, useState, useRef } from 'react';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import socket from '../../../socket';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Form, InputGroup, Card, ListGroup, Image } from 'react-bootstrap';

function Chat() {
    const { conversationId } = useParams();
    const [currentConversation, setCurrentConversation] = useState({});
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const messagesEndRef = useRef(null);

    // Dummy user for demonstration
    const currentUser = { _id: 'me', name: 'You', avatar: 'https://ui-avatars.com/api/?name=You' };

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Example: Fetch conversation and messages (replace with real API)
    useEffect(() => {
        // Fetch conversation info and messages here
        // setCurrentConversation({ ... });
        // setMessages([...]);
    }, [conversationId]);

    // Example: Listen for new messages via socket (replace with real logic)
    useEffect(() => {
        socket.on('newMessage', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });
        return () => socket.off('newMessage');
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        const newMsg = {
            _id: Date.now().toString(),
            sender: currentUser,
            text,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMsg]);
        socket.emit('sendMessage', { conversationId, text });
        setText('');
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '90vh', background: '#f0f2f5' }}>
            <Card style={{ width: '100%', maxWidth: 600, height: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Card.Header className="d-flex align-items-center" style={{ background: '#fff' }}>
                    <Image src={currentConversation.avatar || 'https://ui-avatars.com/api/?name=Chat'} roundedCircle width={40} height={40} className="me-2" />
                    <div>
                        <div className="fw-bold">{currentConversation.name || 'Chat'}</div>
                        <div className="text-muted" style={{ fontSize: 12 }}>Active now</div>
                    </div>
                </Card.Header>
                <Card.Body style={{ overflowY: 'auto', flex: 1, background: '#e5ddd5', padding: '1rem' }}>
                    <ListGroup variant="flush">
                        {messages.map((msg) => (
                            <ListGroup.Item
                                key={msg._id}
                                className={`border-0 d-flex ${msg.sender._id === currentUser._id ? 'justify-content-end' : 'justify-content-start'}`}
                                style={{ background: 'transparent' }}
                            >
                                {msg.sender._id !== currentUser._id && (
                                    <Image src={msg.sender.avatar || 'https://ui-avatars.com/api/?name=User'} roundedCircle width={32} height={32} className="me-2" />
                                )}
                                <div style={{
                                    background: msg.sender._id === currentUser._id ? '#0084ff' : '#fff',
                                    color: msg.sender._id === currentUser._id ? '#fff' : '#000',
                                    borderRadius: 18,
                                    padding: '8px 16px',
                                    maxWidth: 300,
                                    wordBreak: 'break-word'
                                }}>
                                    {msg.text}
                                    <div style={{ fontSize: 10, color: '#888', marginTop: 2, textAlign: 'right' }}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                        <div ref={messagesEndRef} />
                    </ListGroup>
                </Card.Body>
                <Card.Footer style={{ background: '#fff' }}>
                    <Form onSubmit={handleSend}>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Type a message..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                autoFocus
                            />
                            <Button type="submit" variant="primary">
                                Send
                            </Button>
                        </InputGroup>
                    </Form>
                </Card.Footer>
            </Card>
        </Container>
    );
}

export default Chat;