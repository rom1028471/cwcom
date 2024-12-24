import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import UserHeader from './Header';
import UserFooter from './Footer';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

function UserCart() {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateCart,
    clearCart, 
    getTotalPrice 
  } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePeriodChange = (publicationId, currentPeriod, direction) => {
    const periods = [1, 3, 6, 12];
    const currentIndex = periods.indexOf(currentPeriod);
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= periods.length) newIndex = periods.length - 1;
    
    const newPeriod = periods[newIndex];
    
    updateCart(publicationId, newPeriod);
  };

  const handleCreateSubscription = async () => {
    setIsProcessing(true);
    setError('');

    try {
      const subscriptions = cart.map(item => ({
        publicationId: item.id,
        quantity: 1,
        subscriptionPeriod: item.period,
        totalPrice: item.pricePerMonth * item.period
      }));

      await axios.post('/api/subscriptions/create-from-cart', 
        { subscriptions }, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      clearCart();
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось оформить подписку');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/profile');
  };

  return (
    <>
      <UserHeader />
      <div className="container cart-page">
        <h1>Корзина</h1>
        {error && <div className="alert alert-danger">{error}</div>}
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Ваша корзина пуста</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={`${item.id}_${item.period}`} className="cart-item">
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="cart-item-details">
                    <h3>{item.title}</h3>
                    <div className="period-control">
                      <p>Период подписки:</p>
                      <div className="period-selector">
                        <button 
                          onClick={() => handlePeriodChange(item.id, item.period, -1)}
                          disabled={item.period === 1}
                        >
                          -
                        </button>
                        <span>{item.period} мес.</span>
                        <button 
                          onClick={() => handlePeriodChange(item.id, item.period, 1)}
                          disabled={item.period === 12}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p>Цена за месяц: {item.pricePerMonth} руб.</p>
                    <p>Итого: {(item.pricePerMonth * item.period).toFixed(2)} руб.</p>
                    <button 
                      className="btn btn-remove"
                      onClick={() => removeFromCart(item.id, item.period)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <h2>Итого: {getTotalPrice()} руб.</h2>
              <div className="cart-actions">
                <button 
                  className="btn btn-clear"
                  onClick={clearCart}
                >
                  Очистить корзину
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleCreateSubscription}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Оформление...' : 'Оформить подписку'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <UserFooter />

      {/* Модальное окно успешного оформления */}
      <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подписка оформлена</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Ваша подписка успешно оформлена! Вы можете следить за своими подписками в личном кабинете.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            Перейти в профиль
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserCart;
