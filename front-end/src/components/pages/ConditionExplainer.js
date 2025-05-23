import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Info } from 'lucide-react';
import '../css/ConditionExplainer.css';

export function ConditionExplainer({ condition, className = '' }) {
  // Define condition descriptions
  const conditionDescriptions = {
    'Like New': {
      description: 'Almost indistinguishable from a brand new item',
      points: [
        'May be in original packaging or with tags',
        'No signs of use or wear',
        'All original accessories included',
        'Fully functional with no issues',
      ],
    },
    Excellent: {
      description: 'Very minor signs of use with great overall condition',
      points: [
        'Very minimal signs of use',
        'No significant scratches, dents, or marks',
        'Most or all original accessories included',
        'Fully functional with no issues',
      ],
    },
    'Very Good': {
      description: 'Minor signs of use, but well maintained',
      points: [
        'Some signs of previous use',
        'Minor scratches or marks that don’t affect functionality',
        'Most essential accessories included',
        'Fully functional with no significant issues',
      ],
    },
    Good: {
      description: 'Normal signs of use, but still reliable',
      points: [
        'Visible signs of previous use',
        'Noticeable scratches or wear on exterior',
        'Basic accessories may be included',
        'Fully functional but may have minor issues',
      ],
    },
    Fair: {
      description: 'Heavy signs of use, but functional',
      points: [
        'Significant signs of wear and tear',
        'Obvious scratches, dents, or cosmetic damage',
        'May be missing non-essential accessories',
        'Functional but may have some issues',
      ],
    },
  };

  // Get correct condition info or default
  const conditionInfo = conditionDescriptions[condition] || {
    description: 'Condition details unavailable',
    points: ['Contact seller for more information'],
  };

  // Determine color based on condition
  const getConditionColor = () => {
    switch (condition) {
      case 'Like New':
        return 'condition-like-new';
      case 'Excellent':
        return 'condition-excellent';
      case 'Very Good':
        return 'condition-very-good';
      case 'Good':
        return 'condition-good';
      case 'Fair':
        return 'condition-fair';
      default:
        return 'condition-default';
    }
  };

  // Render condition rating visually
  const renderConditionRating = () => {
    const ratings = ['Fair', 'Good', 'Very Good', 'Excellent', 'Like New'];
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
      case 'Like New':
        return 'bg-green';
      case 'Excellent':
        return 'bg-emerald';
      case 'Very Good':
        return 'bg-blue';
      case 'Good':
        return 'bg-amber';
      case 'Fair':
        return 'bg-orange';
      default:
        return 'bg-gray';
    }
  };

  return (
    <Card className={`condition-explainer ${className} ${getConditionColor()}`}>
      <Card.Body className="p-4">
        <div className="d-flex align-items-center mb-2">
          <h3 className="condition-title me-2">Condition: {condition}</h3>
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