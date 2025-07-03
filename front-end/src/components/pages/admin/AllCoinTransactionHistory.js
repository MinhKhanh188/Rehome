// front-end/src/components/pages/admin/AllCoinTransactionHistory.js
import { useEffect, useState } from "react";
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import { Table, Card, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const AllCoinTransactionHistory = () => {
    const [allCoinTransactionHistory, setAllCoinTransactionHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const token = localStorage.getItem(NAME_CONFIG.TOKEN);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(API_ENDPOINTS.GET_ALL_COINS_HISTORY, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAllCoinTransactionHistory(res.data.history || []);
            } catch (err) {
                setError(err.response?.data?.message || "Lỗi khi tải lịch sử giao dịch.");
            }
            setLoading(false);
        };
        fetchHistory();
    }, [token]);

    return (
        <Card className="p-4" style={{ maxWidth: 900, margin: "40px auto" }}>
            <h3 className="mb-4">Lịch sử giao dịch coin (Toàn hệ thống)</h3>
            {loading && <div className="text-center"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên người dùng</th>
                            <th>Mã người dùng</th>
                            <th>Số xu</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allCoinTransactionHistory.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center">Không có giao dịch nào.</td>
                            </tr>
                        ) : (
                            allCoinTransactionHistory.map((tx, idx) => (
                                <tr key={tx._id}>
                                    <td>{idx + 1}</td>
                                    <td>{tx.user?.name || "N/A"}</td>
                                    <td>{tx.user?.uniqueId || "N/A"}</td>
                                    <td>+{tx.amount}</td>
                                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </Card>
    );
};

export default AllCoinTransactionHistory;