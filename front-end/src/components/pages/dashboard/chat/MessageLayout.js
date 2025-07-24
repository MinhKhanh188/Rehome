// front-end/src/components/pages/dashboard/chat/MessageLayout.js
import { useEffect, useRef, useState } from "react";
import { Card, Form, Button, InputGroup, Image } from "react-bootstrap";
import axios from "axios";
import socket from "../../../../socket";
import { API_ENDPOINTS, NAME_CONFIG } from "../../../../config";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MessageLayout({ currentUser, currentConversation }) {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const messagesEndRef = useRef(null);
    const user = jwtDecode(localStorage.getItem(NAME_CONFIG.TOKEN));

    useEffect(() => {
        if (!conversationId) return;

        const fetchMessages = async () => {
            setMessages([]); // ✅ Clear when switching chats
            const res = await axios.get(`${API_ENDPOINTS.GET_MESSAGES}/${conversationId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(NAME_CONFIG.TOKEN)}`,
                },
            });
            setMessages(res.data);
        };
        fetchMessages();

        socket.emit("join_conversation", conversationId);
        return () => socket.emit("leave_conversation", conversationId);
    }, [conversationId]);



    // Lắng nghe tin nhắn mới từ socket, chỉ cập nhật khi nhận từ socket
    useEffect(() => {
        const handler = (msg) => {
            setMessages(prev => {
                // Nếu đã có message với _id này thì không thêm nữa
                if (prev.some(m => m._id === msg._id)) return prev;
                return [...prev, msg];
            });
        };
        socket.on("receive_message", handler);
        return () => socket.off("receive_message", handler);
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Gửi tin nhắn: KHÔNG setMessages ở đây, chỉ emit lên socket
    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const token = localStorage.getItem(NAME_CONFIG.TOKEN);
            const res = await axios.post(API_ENDPOINTS.SEND_MESSAGE, {
                conversationId,
                text,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Emit lên socket, không setMessages ở đây!
            socket.emit("send_message", res.data);
            setText("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    // Xác định user đối phương
    const otherUser = currentConversation?.participants?.find(p => p._id !== user.id);

    return (
        <Card className="flex-grow-1 d-flex flex-column">
            <Card.Header className="d-flex align-items-center">
                <Image
                    src={otherUser?.avatarUrl
                        ? otherUser.avatarUrl
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || "User")}`
                    }
                    roundedCircle
                    width={40}
                    height={40}
                    className="me-2"
                />
                <div className="fw-bold">
                    {otherUser?.name || "Unknown"}
                </div>
            </Card.Header>
            <Card.Body className="flex-grow-1 overflow-auto" style={{ background: "#e5ddd5", maxHeight: "700px" }}>
                {messages.map((msg) => {
                    const time = new Date(msg.sentAt || msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                    const isOwnMessage = msg.senderId === user.id;
                    const isSharedPost = msg.post;

                    return (
                        <div
                            key={msg._id}
                            className={`d-flex mb-2 ${isOwnMessage ? "justify-content-end" : "justify-content-start"}`}
                        >
                            <div
                                style={{
                                    background: isSharedPost ? "#f0f0f0" : isOwnMessage ? "#0084ff" : "#fff",
                                    color: isSharedPost ? "#000" : isOwnMessage ? "#fff" : "#000",
                                    borderRadius: 18,
                                    padding: "8px 16px",
                                    maxWidth: "75%",
                                    wordBreak: "break-word"
                                }}

                            >
                                {/* 👇 If it's a shared post, render preview */}
                                {isSharedPost ? (
                                    <div>
                                        <div style={{ fontWeight: "bold", marginBottom: 4 }}>{msg.post.name}</div>
                                        <div style={{ fontSize: 13, marginBottom: 8 }}>{msg.post.description}</div>
                                        {msg.post.images?.[0] && (
                                            <Image
                                                src={msg.post.images[0]}
                                                alt="shared"
                                                thumbnail
                                                style={{ maxWidth: "100%", borderRadius: 8 }}
                                            />
                                        )}
                                    </div>
                                ) : (
                                    msg.text
                                )}

                                <div style={{ fontSize: 10, color: "#ccc", marginTop: 4, textAlign: "right" }}>
                                    {time}
                                </div>
                            </div>
                        </div>
                    );
                })}


                <div ref={messagesEndRef} />
            </Card.Body>
            <Card.Footer>
                <Form onSubmit={handleSend}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <Button type="submit" variant="primary" style={{ marginLeft: 8 }}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </Button>
                    </InputGroup>
                </Form>
            </Card.Footer>
        </Card>
    );
}
