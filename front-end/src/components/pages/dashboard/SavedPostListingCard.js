// front-end/src/components/pages/dashboard/SavedPostListingCard.js
import { useState } from 'react';
import { Card, Dropdown, Button, Badge } from 'react-bootstrap';
import { MoreVertical, Trash } from 'lucide-react';
import '../../css/ProductListingCard.css';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, NAME_CONFIG } from '../../../config';
import axios from 'axios';

const SavedPostListingCard = ({
    product: propProduct,
    stats: propStats = {},
    onDeleted
}) => {

    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const {
        _id,
        postId,
        name,
        images = [],
        status,
        is_vip,
        price,
        category,
        productStatus,
        createdAt,
    } = propProduct;


    const handleDeleteSavedItems = async () => {
        const token = localStorage.getItem(NAME_CONFIG.TOKEN);
        if (!token) return;

        try {
            await axios.delete(API_ENDPOINTS.REMOVE_MY_SAVED_POST(_id), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Remove the deleted post from state
            if (onDeleted) onDeleted(_id);

        } catch (error) {
            alert('Có lỗi xảy ra khi xóa bài đăng.');
        }
    };




    return (
        <Card className="listing-card shadow-sm">
            <div className="listing-image-container">
                <Card.Img
                    variant="top"
                    src={images[0] || 'https://via.placeholder.com/150'}
                    alt={name}
                    className="listing-image"
                />
                <Badge
                    className={`status-badge ${status === 'sold'
                        ? 'sold'
                        : status === 'archived'
                            ? 'archived'
                            : status === 'pending'
                                ? 'pending'
                                : status === 'hidden'
                                    ? 'hidden'
                                    : is_vip
                                        ? 'vip'
                                        : 'active'
                        }`}
                >
                    {status === 'sold'
                        ? 'Đã bán'
                        : status === 'archived'
                            ? 'Đã lưu trữ'
                            : status === 'pending'
                                ? 'Đang chờ duyệt'
                                : status === 'hidden'
                                    ? 'Đang ẩn'
                                    : is_vip
                                        ? 'VIP'
                                        : 'Đang bày bán'}
                </Badge>


            </div>

            <Card.Body className="menu p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="listing-title">{name}</Card.Title>
                    <Dropdown onToggle={() => setShowMenu(!showMenu)} show={showMenu}>
                        <Dropdown.Toggle
                            as={Button}
                            variant="link"
                            className="menu-toggle p-1"
                        >
                            <MoreVertical size={20} className="text-gray-500" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" className="listing-menu">

                            <Dropdown.Item
                                onClick={() => handleDeleteSavedItems()}
                                className="d-flex align-items-center text-danger"
                            >
                                <Trash size={16} className="me-2" />
                                Xoá
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <Card.Text className="listing-category">
                    {category || 'Không rõ danh mục'}
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="listing-price">{price.toLocaleString()}₫</span>
                    <Badge className="listing-condition">{productStatus}</Badge>
                </div>

                <div className="listing-stats pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="listing-date">
                            Đăng ngày {new Date(createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};


export default SavedPostListingCard;