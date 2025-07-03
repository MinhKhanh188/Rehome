// front-end/src/components/pages/dashboard/chat/ConversationList.js
import { useEffect, useState } from "react";
import { ListGroup, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API_ENDPOINTS, NAME_CONFIG } from "../../../../config";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function ConversationList({ onSelect }) {
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const [conversations, setConversations] = useState([]);
    const user = jwtDecode(localStorage.getItem(NAME_CONFIG.TOKEN));

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.GET_USER_CONVERSATIONS, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(NAME_CONFIG.TOKEN)}`
                    }
                });
                setConversations(res.data);
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            }
        };
        fetchConversations();
    }, []);

    return (
        <>
            <h5>Đoạn chat</h5>
            {conversations.length === 0 ? (
                <p className="text-muted text-center mt-3">No conversations yet.</p>
            ) : (
                <ListGroup variant="flush">
                    {conversations.map(c => {
                        // Skip self-conversations
                        const allSameUser = c.participants.every(p => p._id === user.id);
                        if (allSameUser) return null;
                        // Get other user
                        const otherUser = c.participants.find(p => p._id !== user.id);
                        return (
                            <ListGroup.Item
                                key={c._id}
                                action
                                active={c._id === conversationId}
                                onClick={() => {
                                    navigate(`/dashboard/chat/${c._id}`);
                                    onSelect(c);
                                }}
                                className="d-flex align-items-center"
                            >
                                <Image
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || "User")}`}
                                    roundedCircle
                                    width={40}
                                    height={40}
                                    className="me-2"
                                />
                                <div>
                                    <strong>{otherUser?.name || "Unknown"}</strong><br />
                                    <small className="text-muted">{c.lastMessage?.text?.slice(0, 30) || "No message yet"}</small>
                                </div>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            )}
        </>
    );
}
