import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { formatDate } from '../utils/dateUtils';

const SubscriptionModal = ({ show, onHide, subscription, onCancel }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Информация о подписке</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {subscription && (
          <div>
            <h5>{subscription.publication.title}</h5>
            <p><strong>Статус:</strong> {subscription.active ? 'Активна' : 'Отменена'}</p>
            <p><strong>Дата начала:</strong> {formatDate(subscription.startDate)}</p>
            <p><strong>Дата окончания:</strong> {formatDate(subscription.endDate)}</p>
            <p><strong>Период подписки:</strong> {subscription.subscriptionPeriod} мес.</p>
            <p><strong>Стоимость:</strong> {subscription.totalPrice} руб.</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        {subscription && subscription.active && (
          <Button variant="danger" onClick={() => onCancel(subscription.id)}>
            Отменить подписку
          </Button>
        )}
        <Button variant="secondary" onClick={onHide}>
          Закрыть
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubscriptionModal; 