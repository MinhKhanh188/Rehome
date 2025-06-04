import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import '../css/ProductSpecifications.css';

export function ProductSpecifications({ specifications, product, className = '' }) {
  const [expanded, setExpanded] = useState(false);

  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  // Get category-specific spec descriptions
  const getSpecDescription = (key) => {
    const descriptions = {
      smartphones: {
        Storage: 'Total internal storage capacity for apps, photos, videos and files',
        'Screen Size': 'Diagonal screen size measured in inches',
        Processor: 'Main computing component that powers the device',
        Battery: 'Battery capacity measured in mAh',
        Camera: 'Main rear camera specifications',
        OS: 'Operating system version',
      },
      laptops: {
        Processor: 'CPU model that powers the laptop',
        RAM: 'Memory available for running applications',
        Storage: 'SSD/HDD capacity for data storage',
        Display: 'Screen size and resolution',
        Graphics: 'GPU for rendering visuals',
        'Battery Life': 'Average usage time on a full charge',
      },
    };

    // Get the normalized category
    const normalizedCategory = product.category.toLowerCase().replace(/[^a-z0-9]/g, '');
    const categoryMatch = Object.keys(descriptions).find((cat) =>
      normalizedCategory.includes(cat)
    );

    if (categoryMatch && descriptions[categoryMatch][key]) {
      return descriptions[categoryMatch][key];
    }

    return '';
  };

  // Split specifications into visible and hidden
  const allSpecs = Object.entries(specifications);
  const visibleSpecs = expanded ? allSpecs : allSpecs.slice(0, 6);
  const hasMoreSpecs = allSpecs.length > 6;

  return (
    <Card className={`product-specifications ${className}`}>
      <Card.Body className="p-5">
        <h2 className="specifications-title">Thông Số Kỹ Thuật Sản Phẩm</h2>

        <div className="specifications-list">
          {visibleSpecs.map(([key, value]) => {
            const description = getSpecDescription(key);

            return (
              <div key={key} className="specification-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="spec-key d-flex align-items-center gap-1">
                    {key}
                    {description && (
                      <div className="tooltip-container">
                        <Info size={14} className="info-icon" />
                        <div className="tooltip">
                          {description}
                          <div className="tooltip-arrow"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="spec-value">{value}</div>
                </div>
              </div>
            );
          })}
        </div>

        {hasMoreSpecs && (
          <Button
            variant="outline-secondary"
            className="toggle-button w-100 mt-3"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp size={16} className="me-1" />
                Hiện Ít Hơn
              </>
            ) : (
              <>
                <ChevronDown size={16} className="me-1" />
                Hiện Tất Cả Thông Số
              </>
            )}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}