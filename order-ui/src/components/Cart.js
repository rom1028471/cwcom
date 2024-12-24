import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { getCart, removeFromCart } from '../api/cartApi';
import { createSubscriptionsFromCart } from '../api/subscriptionApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const data = await getCart();
      setCartItems(data);
    } catch (error) {
      toast.error('Ошибка при загрузке корзины');
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId);
      await loadCart();
      toast.success('Товар удален из корзины');
    } catch (error) {
      toast.error('Ошибка при удалении из корзины');
    }
  };

  const handleCreateSubscriptions = async () => {
    try {
      setLoading(true);
      const result = await createSubscriptionsFromCart();
      if (result) {
        toast.success('Подписки успешно оформлены');
        navigate('/profile/subscriptions');
      }
    } catch (error) {
      console.error('Ошибка при оформлении подписок:', error);
      toast.error('Ошибка при оформлении подписок');
    } finally {
      setLoading(false);
      await loadCart();
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  return (
    <div className="cart-page">
      <Container>
        <h2>Корзина</h2>
        {cartItems.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Период подписки</th>
                  <th>Стоимость</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.publication.title}</td>
                    <td>{item.subscriptionPeriod} мес.</td>
                    <td>{item.totalPrice} руб.</td>
                    <td>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleRemoveFromCart(item.id)}
                        disabled={loading}
                      >
                        Удалить
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" className="text-end"><strong>Итого:</strong></td>
                  <td colSpan="2"><strong>{calculateTotal()} руб.</strong></td>
                </tr>
              </tbody>
            </Table>
            <div className="cart-actions">
              <Button 
                variant="primary" 
                onClick={handleCreateSubscriptions}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Оформление...' : 'Оформить подписки'}
              </Button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <p>Корзина пуста</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Cart; 