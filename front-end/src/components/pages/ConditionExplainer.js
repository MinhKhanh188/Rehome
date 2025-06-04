import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Info } from 'lucide-react';
import '../css/ConditionExplainer.css';

export function ConditionExplainer({ condition, className = '' }) {
  // Define condition descriptions
  const conditionDescriptions = {
  "Mới": {
    description: "Gần như không thể phân biệt với sản phẩm mới",
    points: [
      "Có thể còn bao bì gốc hoặc còn tem nhãn",
      "Không có dấu hiệu sử dụng hoặc hao mòn",
      "Bao gồm đầy đủ phụ kiện gốc",
      "Hoạt động hoàn hảo, không có lỗi"
    ]
  },
  "Gần như mới": {
    description: "Dấu hiệu sử dụng rất nhẹ, tổng thể còn rất tốt",
    points: [
      "Dấu hiệu sử dụng rất nhẹ",
      "Không có trầy xước, móp hoặc hư hại đáng kể",
      "Có đầy đủ hoặc hầu hết phụ kiện gốc",
      "Hoạt động hoàn hảo, không có lỗi"
    ]
  },
  "Cũ": {
    description: "Nhiều dấu hiệu sử dụng, nhưng vẫn còn dùng được",
    points: [
      "Hao mòn rõ rệt",
      "Có vết trầy xước, móp hoặc hư hại thẩm mỹ dễ thấy",
      "Có thể thiếu phụ kiện không quan trọng",
      "Vẫn sử dụng được nhưng có thể gặp một số vấn đề nhỏ"
    ]
  }
};
  // Get correct condition info or default
  const conditionInfo = conditionDescriptions[condition] || {
    description: 'Condition details unavailable',
    points: ['Contact seller for more information'],
  };

  // Determine color based on condition
  const getConditionColor = () => {
    switch (condition) {
      case 'Mới':
        return 'condition-like-new';
      case 'Like New':
        return 'condition-new';
      case 'Cũ':
        return 'condition-fair';
      default:
        return 'condition-default';
    }
  };

  // Render condition rating visually
  const renderConditionRating = () => {
    const ratings = ['Cũ', 'Like New', 'Mới'];
    const currentIndex = ratings.indexOf(condition);

    return (
      <Row className="condition-rating mt-2 mb-3 gx-1 align-items-center">
        {ratings.map((rating, index) => (
          <Col key={rating} xs="auto" className="text-center">
            <div
              className={`rating-bar ${
                index <= currentIndex ? getCircleColor(rating) : 'bg-gray'
              } ${index === 0 ? 'rounded-start' : ''} ${
                index === ratings.length - 1 ? 'rounded-end' : ''
              }`}
            />
            {index === currentIndex && (
              <span className="rating-label">{rating}</span>
            )}
          </Col>
        ))}
      </Row>
    );
  };

  // Get color for rating circles
  const getCircleColor = (rating) => {
    switch (rating) {
      case 'Mới':
        return 'bg-green';
      case 'Like New':
        return 'bg-emerald';
      case 'Cũ':
        return 'bg-orange';
      default:
        return 'bg-gray';
    }
  };

  return (
    <Card className={`condition-explainer ${className} ${getConditionColor()}`}>
      <Card.Body className="p-4">
        <div className="d-flex align-items-center mb-2">
          <h3 className="condition-title me-2">Tình trạng: {condition}</h3>
          <Info size={16} className="info-icon" />
        </div>

        {renderConditionRating()}

        <p className="condition-description">{conditionInfo.description}</p>

        <ul className="condition-points">
          {conditionInfo.points.map((point, index) => (
            <li key={index} className="condition-point">
              <span className="bullet">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
}