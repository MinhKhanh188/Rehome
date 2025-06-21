// front-end/src/components/pages/admin/AdminInsertCoins.js
import React, { useState } from "react";
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import { Form, Button, Alert, Card, InputGroup, Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";

const AdminInsertCoins = () => {
    const [uniqueId, setUniqueId] = useState("");
    const [user, setUser] = useState(null);
    const [searchError, setSearchError] = useState("");
    const [coinAmount, setCoinAmount] = useState("");
    const [insertMsg, setInsertMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [inserting, setInserting] = useState(false);
    const token = localStorage.getItem(NAME_CONFIG.TOKEN);

    // Search user by uniqueId
    const handleSearch = async (e) => {
        e.preventDefault();
        setUser(null);
        setSearchError("");
        setInsertMsg("");
        setLoading(true);
        try {
            const res = await axios.get(
                `${API_ENDPOINTS.FIND_USER_BY_UNIQUEID}/${uniqueId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUser(res.data.user);
        } catch (err) {
            setSearchError(err.response?.data?.message || "Không tìm thấy người dùng.");
        }
        setLoading(false);
    };

    // Insert coins
    const handleInsertCoins = async (e) => {
        e.preventDefault();
        setInsertMsg("");
        setInserting(true);
        try {
            const res = await axios.post(
                `${API_ENDPOINTS.INCREASE_COIN}/${user._id}`,
                { amount: coinAmount },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setInsertMsg(res.data.message);
            setUser({ ...user, coin: res.data.coin });
            setCoinAmount("");
        } catch (err) {
            setInsertMsg(err.response?.data?.message || "Lỗi khi cộng coin.");
        }
        setInserting(false);
    };

    return (
        <Card className="p-4" style={{ maxWidth: 500, margin: "40px auto" }}>
            <h3 className="mb-4">Tìm kiếm người dùng & Cộng coin</h3>
            <Form onSubmit={handleSearch}>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="Nhập uniqueId người dùng"
                        value={uniqueId}
                        onChange={e => setUniqueId(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? <Spinner size="sm" animation="border" /> : "Tìm kiếm"}
                    </Button>
                </InputGroup>
            </Form>
            {searchError && <Alert variant="danger">{searchError}</Alert>}
            {user && (
                <Card className="mb-3 p-3">
                    <Row>
                        <Col xs={12}>
                            <strong>Tên:</strong> {user.name}
                        </Col>
                        <Col xs={12}>
                            <strong>Email:</strong> {user.email}
                        </Col>
                        <Col xs={12}>
                            <strong>Coin hiện tại:</strong> {user.coin}
                        </Col>
                        <Col xs={12}>
                            <strong>uniqueId:</strong> {user.uniqueId}
                        </Col>
                    </Row>
                    <Form className="mt-3" onSubmit={handleInsertCoins}>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                min="1"
                                placeholder="Số coin muốn cộng"
                                value={coinAmount}
                                onChange={e => setCoinAmount(e.target.value)}
                                required
                            />
                            <Button type="submit" variant="success" disabled={inserting}>
                                {inserting ? <Spinner size="sm" animation="border" /> : "Cộng coin"}
                            </Button>
                        </InputGroup>
                    </Form>
                    {insertMsg && <Alert className="mt-2" variant={insertMsg.includes("Đã cộng") ? "success" : "danger"}>{insertMsg}</Alert>}
                </Card>
            )}
        </Card>
    );
};

export default AdminInsertCoins;