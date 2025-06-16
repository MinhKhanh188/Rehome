// front-end/src/components/pages/dashboard/Chat.js
import { useEffect, useState } from 'react';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import socket from '../../../socket';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

function ChatBox() {
    const { conversationId } = useParams();
    const [currentConversation, setCurrentConversation] = useState({});
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    return (
        <>
        </>
    )
}