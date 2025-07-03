// front-end/src/components/pages/dashboard/ViewSavedPost.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import axios from 'axios';
import SavedPostListingCard from './SavedPostListingCard';

const ViewSavedPost = () => {
    const navigate = useNavigate();
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(API_ENDPOINTS.GET_MY_SAVED_POSTS, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(NAME_CONFIG.TOKEN)}`,
                    },
                });
                setSavedPosts(res.data);
            } catch (err) {
                setError(err.response?.data?.error || "Lỗi khi tải bài đăng đã lưu.");
            }
            setLoading(false);
        };
        fetchSavedPosts();
    }, []);

    const handleRemoveSavedPost = (id) => {
        setSavedPosts((prev) => prev.filter((item) => item._id !== id));
    };


    return (
        <Container className="py-5">
            <h1 className="mb-4">Bài đăng đã lưu</h1>

            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && savedPosts.length === 0 && (
                <p>Không có bài đăng đã lưu.</p>
            )}

            <Row className="g-4">
                {savedPosts.map((post) => (
                    <Col md={6} lg={4} key={post._id}>
                        <SavedPostListingCard
                            product={{ ...post }}
                            onDeleted={handleRemoveSavedPost}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ViewSavedPost;
