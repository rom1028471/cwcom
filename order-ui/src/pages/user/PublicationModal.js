import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../../context/CartContext';
import { checkActiveSubscription } from '../../api/subscriptionApi';

// Импортируем изображения
import NationalGeographic from '../../catalog_images/National_Geographic.jpg';
import Nature from '../../catalog_images/Nature.jpg';
import NewScientist from '../../catalog_images/New Scientist.jpg';
import ScientificAmerican from '../../catalog_images/Scientific American.jpg';
import ScienceMagazine from '../../catalog_images/Science.jpg';
import TheEconomist from '../../catalog_images/The Economist.jpeg';
import Forbes from '../../catalog_images/Forbes.jpg';
import TimeMagazine from '../../catalog_images/TIME Magazine.jpg';
import TheNewYorkTimes from '../../catalog_images/The New York Times.jpg';
import TheWallStreetJournal from '../../catalog_images/The Wall Street Journal.jpg';
import TheWashingtonPost from '../../catalog_images/The Washington Post.jpg';

// Маппинг названий публикаций на изображения
const publicationImages = {
  'National Geographic': NationalGeographic,
  'Nature': Nature,
  'New Scientist': NewScientist,
  'Scientific American': ScientificAmerican,
  'Science': ScienceMagazine,
  'The Economist': TheEconomist,
  'Forbes': Forbes,
  'TIME': TimeMagazine,
  'The New York Times': TheNewYorkTimes,
  'The Wall Street Journal': TheWallStreetJournal,
  'The Washington Post': TheWashingtonPost
};

// Газеты для определения соотношения сторон
const newspapers = [
  'The New York Times',
  'The Wall Street Journal',
  'The Washington Post'
];

function PublicationModal({ publication, onClose }) {
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const periods = [1, 3, 6, 12];
  const { cart, addToCart } = useCart();

  useEffect(() => {
    document.body.classList.add('modal-open');

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await checkActiveSubscription(publication.id);
        setActiveSubscription(response);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при проверке подписки:', error);
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [publication.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleClose = () => {
    document.body.classList.remove('modal-open');
    onClose();
  };

  const handleAddToCart = () => {
    const existingItem = cart.find(
      item => item.id === publication.id
    );

    if (existingItem) {
      toast.info(
        `"${publication.title}" уже в корзине. Вы можете изменить количество или период подписки в корзине.`, 
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } else {
      addToCart(publication, selectedPeriod);
      
      const event = new CustomEvent('add-to-cart', {
        detail: { 
          publication, 
          period: selectedPeriod 
        }
      });
      window.dispatchEvent(event);
      
      toast.success(
        `"${publication.title}" добавлен в корзину на ${selectedPeriod} мес.`, 
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }

    handleClose();
  };

  const getPublicationImage = () => {
    return publicationImages[publication.title] || '/assets/default-cover.jpg';
  };

  const isNewspaper = newspapers.includes(publication.title);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          <FaTimes />
        </button>
        
        <div className={`modal-image-container ${publication.type === 'NEWSPAPER' ? 'newspaper' : ''}`}>
          <div className="modal-image">
            <img 
              src={getPublicationImage()} 
              alt={publication.title}
            />
          </div>
        </div>

        <div className="modal-details-container">
          <div className="modal-details">
            <h2>{publication.title}</h2>
            <p>{publication.description}</p>
            <div className="modal-actions">
              <p>Цена за месяц: {publication.pricePerMonth} руб.</p>
              
              {loading ? (
                <p>Проверка статуса подписки...</p>
              ) : activeSubscription?.hasActiveSubscription ? (
                <div className="active-subscription-info">
                  <div className="active-subscription-message">
                    У вас есть активная подписка до {formatDate(activeSubscription.endDate)}
                  </div>
                </div>
              ) : (
                <>
                  <div className="period-slider-container">
                    <input 
                      type="range" 
                      min="0" 
                      max="3" 
                      step="1" 
                      value={periods.indexOf(selectedPeriod)}
                      onChange={(e) => setSelectedPeriod(periods[e.target.value])}
                      className="period-slider"
                    />
                    <div className="period-labels">
                      {periods.map((period) => (
                        <span 
                          key={period} 
                          className={`period-label ${selectedPeriod === period ? 'active' : ''}`}
                        >
                          {period} мес.
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="total-price">
                    <p>Итого: {(publication.pricePerMonth * selectedPeriod).toFixed(2)} руб.</p>
                  </div>

                  <button 
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                  >
                    Добавить в корзину
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicationModal;
