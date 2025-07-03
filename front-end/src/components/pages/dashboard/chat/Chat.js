// front-end/src/components/pages/dashboard/chat/Chat.js
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route, useParams } from "react-router-dom";
import ConversationList from "./ConversationList";
import MessageLayout from "./MessageLayout";

export default function Chat() {
    const { conversationId } = useParams();
    const [currentConversation, setCurrentConversation] = useState(null);

    const currentUser = {
        _id: JSON.parse(localStorage.getItem("user"))?._id || "me",
        name: "You",
        avatar: "https://ui-avatars.com/api/?name=You"
    };

    return (
        <Container fluid style={{ height: "600px", paddingTop: "20px" }}>
            <Row className="h-100">
                <Col md={4} style={{ borderRight: "1px solid #ddd", overflowY: "auto" }}>
                    <ConversationList currentUser={currentUser} onSelect={setCurrentConversation} />
                </Col>
                <Col md={8} className="d-flex flex-column">
                    <Routes>
                        <Route
                            path=":conversationId"
                            element={
                                <MessageLayout
                                    conversationId={conversationId}
                                    currentUser={currentUser}
                                    currentConversation={currentConversation}
                                />
                            }
                        />
                        <Route
                            path=""
                            element={
                                <div className="d-flex flex-grow-1 align-items-center justify-content-center text-muted">
                                    Chọn một người để mở cửa sổ trò chuyện
                                </div>
                            }
                        />
                    </Routes>
                </Col>
            </Row>
        </Container>
    );
}
