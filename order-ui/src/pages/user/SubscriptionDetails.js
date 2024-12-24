import React from 'react';

function SubscriptionDetails({ subscription, onClose }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'orange';
      case 'ACTIVE': return 'green';
      case 'PROCESSING': return 'blue';
      case 'COMPLETED': return 'gray';
      case 'CANCELLED': return 'red';
      default: return 'black';
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Детали подписки</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <div className="subscription-details-modal">
            <div className="publication-info">
              <img 
                src={subscription.publication.imageUrl} 
                alt={subscription.publication.title} 
              />
              <h3>{subscription.publication.title}</h3>
            </div>

            <div className="subscription-details-grid">
              <div className="detail-item">
                <strong>Статус:</strong>
                <span 
                  style={{color: getStatusColor(subscription.status)}}
                >
                  {subscription.status}
                </span>
              </div>
              <div className="detail-item">
                <strong>Период подписки:</strong>
                <span>{subscription.subscriptionPeriod} мес.</span>
              </div>
              <div className="detail-item">
                <strong>Количество:</strong>
                <span>{subscription.quantity}</span>
              </div>
              <div className="detail-item">
                <strong>Начало подписки:</strong>
                <span>{new Date(subscription.startDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <strong>Окончание подписки:</strong>
                <span>{new Date(subscription.endDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <strong>Итого:</strong>
                <span>{subscription.totalPrice.toFixed(2)} руб.</span>
              </div>
            </div>

            <div className="delivery-info">
              <h4>Адрес доставки</h4>
              <p>{subscription.user.address}</p>
              <p>{subscription.user.city}, {subscription.user.postalCode}</p>
              <p>Телефон: {subscription.user.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionDetails;
