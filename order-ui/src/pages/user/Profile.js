import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import UserHeader from './Header';
import UserFooter from './Footer';
import { FaUser, FaMapMarkerAlt, FaPhone, FaCity, FaEnvelope, FaNewspaper } from 'react-icons/fa';
import { formatDate } from '../../utils/dateUtils';
import { Modal, Button } from 'react-bootstrap';

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

const Profile = () => {
    const { token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        phoneNumber: ''
    });
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPeriodModal, setShowPeriodModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [newPeriod, setNewPeriod] = useState(1);

    // Добавим список газет для определения соотношения сторон
    const newspapers = [
        'The New York Times',
        'The Wall Street Journal',
        'The Washington Post'
    ];

    useEffect(() => {
        fetchProfileData();
        fetchSubscriptions();
    }, []);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const fullName = response.data.name || '';
            const [firstName = '', lastName = ''] = fullName.split(' ');
            
            setProfileData({
                ...response.data,
                firstName,
                lastName
            });
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            setError('Не удалось загрузить данные профиля');
            toast.error('Не удалось загрузить данные профиля');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubscriptions = async () => {
        try {
            const response = await axios.get('/api/subscriptions/my', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSubscriptions(response.data);
        } catch (error) {
            console.error('Ошибка загрузки подписок:', error);
            toast.error('Не удалось загрузить подписки');
        }
    };

    const handleCancelSubscription = async (subscriptionId) => {
        try {
            await axios.delete(`/api/subscriptions/${subscriptionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Подписка успешно отменена');
            fetchSubscriptions(); // Обновляем список подписок
        } catch (error) {
            console.error('Ошибка отмены подписки:', error);
            toast.error('Не удалось отменить подписку');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            
            // Объединяем firstName и lastName в поле name
            const dataToSend = {
                ...profileData,
                name: `${profileData.firstName} ${profileData.lastName}`.trim()
            };
            
            const response = await axios.put(
                'http://localhost:8080/api/users/profile',
                dataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            // Разделяем полное имя на firstName и lastName
            const fullName = response.data.name || '';
            const [firstName = '', lastName = ''] = fullName.split(' ');
            
            setProfileData({
                ...response.data,
                firstName,
                lastName
            });
            
            setIsEditing(false);
            toast.success('Профиль успешно обновлен');
        } catch (error) {
            console.error('Ошибка обновления профиля:', error);
            setError('Не удалось обновить профиль');
            toast.error('Не удалось обновить профиль');
        }
    };

    const handleUpdatePeriod = async () => {
        try {
            await axios.put(`/api/subscriptions/${selectedSubscription.id}/period`, 
                { subscriptionPeriod: newPeriod },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            toast.success('Период подписки успешно изменен');
            fetchSubscriptions(); // Обновляем список подписок
            setShowPeriodModal(false);
        } catch (error) {
            console.error('Ошибка изменения периода:', error);
            toast.error(error.response?.data?.message || 'Не удалось изменить пер��од подписки');
        }
    };

    const openPeriodModal = (subscription) => {
        setSelectedSubscription(subscription);
        setNewPeriod(subscription.subscriptionPeriod);
        setShowPeriodModal(true);
    };

    const openDetailsModal = (subscription) => {
        setSelectedSubscription(subscription);
        setShowDetailsModal(true);
    };

    const getActiveSubscriptions = () => {
        return subscriptions.filter(sub => sub.active);
    };

    const getInactiveSubscriptions = () => {
        return subscriptions.filter(sub => !sub.active);
    };

    const handleEditPeriod = (subscription) => {
        setSelectedSubscription(subscription);
        setNewPeriod(subscription.subscriptionPeriod);
        setShowDetailsModal(false);
        setShowPeriodModal(true);
    };

    // Функция для получения изображения публикации
    const getPublicationImage = (title) => {
        return publicationImages[title] || '/assets/default-cover.jpg';
    };

    if (loading) {
        return (
            <>
                <UserHeader />
                <div className="container mt-4">Загрузка...</div>
                <UserFooter />
            </>
        );
    }

    return (
        <div className="user-profile-container">
            <UserHeader />
            <div className="profile-content">
                <div className="profile-details">
                    <section className="profile-card">
                        <div className="profile-header">
                            <FaUser className="profile-icon" />
                            <h2>Личный профиль</h2>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        {isEditing ? (
                            <form onSubmit={handleSave} className="profile-edit-form">
                                <div className="input-group">
                                    <FaEnvelope />
                                    <input
                                        type="email"
                                        className="form-control disabled-input"
                                        value={profileData.email}
                                        disabled
                                    />
                                </div>
                                <div className="input-group">
                                    <FaUser />
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="firstName"
                                        placeholder="Имя"
                                        value={profileData.firstName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <FaUser />
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="lastName"
                                        placeholder="Фамилия"
                                        value={profileData.lastName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <FaMapMarkerAlt />
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        placeholder="Адрес"
                                        value={profileData.address || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <FaCity />
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="city"
                                        placeholder="Город"
                                        value={profileData.city || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <FaMapMarkerAlt />
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="postalCode"
                                        placeholder="Почтовый индекс"
                                        value={profileData.postalCode || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="input-group">
                                    <FaPhone />
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phoneNumber"
                                        placeholder="Телефон"
                                        value={profileData.phoneNumber || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="profile-actions">
                                    <button type="submit" className="btn-save">
                                        Сохранить
                                    </button>
                                    <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
                                        Отмена
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="profile-view">
                                <div className="profile-detail">
                                    <FaEnvelope />
                                    <div>
                                        <strong>Email:</strong>
                                        <p>{profileData.email}</p>
                                    </div>
                                </div>
                                <div className="profile-detail">
                                    <FaUser />
                                    <div>
                                        <strong>Имя:</strong>
                                        <p>{profileData.firstName || 'Не указано'}</p>
                                    </div>
                                </div>
                                <div className="profile-detail">
                                    <FaUser />
                                    <div>
                                        <strong>Фамилия:</strong>
                                        <p>{profileData.lastName || 'Не указано'}</p>
                                    </div>
                                </div>
                                <div className="profile-detail">
                                    <FaMapMarkerAlt />
                                    <div>
                                        <strong>Адрес:</strong>
                                        <p>{profileData.address || 'Не указано'}</p>
                                    </div>
                                </div>
                                <div className="profile-detail">
                                    <FaCity />
                                    <div>
                                        <strong>Город:</strong>
                                        <p>{profileData.city || 'Не указано'}</p>
                                    </div>
                                </div>
                                <div className="profile-detail">
                                    <FaMapMarkerAlt />
                                    <div>
                                        <strong>Почтовый индекс:</strong>
                                        <p>{profileData.postalCode || 'Не указано'}</p>
                                    </div>
                                </div>
                                <div className="profile-detail">
                                    <FaPhone />
                                    <div>
                                        <strong>Телефон:</strong>
                                        <p>{profileData.phoneNumber || 'Не указано'}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsEditing(true)} className="btn-edit">
                                    Редактировать профиль
                                </button>
                            </div>
                        )}
                    </section>

                    <section className="profile-card">
                        <div className="profile-header">
                            <FaNewspaper className="profile-icon" />
                            <h2>Мои подписки</h2>
                        </div>

                        {/* Активные подписки */}
                        <div className="subscriptions-section">
                            <h3>Активные подписки</h3>
                            <div className="subscriptions-list">
                                {getActiveSubscriptions().length === 0 ? (
                                    <p>У вас нет активных подписок</p>
                                ) : (
                                    getActiveSubscriptions().map(subscription => (
                                        <div 
                                            key={subscription.id} 
                                            className="subscription-item"
                                            onClick={() => openDetailsModal(subscription)}
                                        >
                                            <h3 className="subscription-title">
                                                {subscription.publication.title}
                                            </h3>
                                            <div className="subscription-info">
                                                <p>Период: {subscription.subscriptionPeriod} мес.</p>
                                                <p>Окончание: {formatDate(subscription.endDate)}</p>
                                                <p>Стоимость: {subscription.totalPrice} руб.</p>
                                            </div>
                                            <div className="subscription-status status-active">
                                                Активна
                                            </div>
                                            <div className="subscription-actions">
                                                <button
                                                    className="btn-edit-subscription"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openPeriodModal(subscription);
                                                    }}
                                                >
                                                    Изменить период
                                                </button>
                                                <button
                                                    className="btn-cancel-subscription"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCancelSubscription(subscription.id);
                                                    }}
                                                >
                                                    Отменить подписку
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Завершенные подписки */}
                        <div className="subscriptions-section">
                            <h3>Завершенные подписки</h3>
                            <div className="subscriptions-list">
                                {getInactiveSubscriptions().length === 0 ? (
                                    <p>У вас нет завершенных подписок</p>
                                ) : (
                                    getInactiveSubscriptions().map(subscription => (
                                        <div 
                                            key={subscription.id} 
                                            className="subscription-item"
                                            onClick={() => openDetailsModal(subscription)}
                                        >
                                            <h3 className="subscription-title">
                                                {subscription.publication.title}
                                            </h3>
                                            <div className="subscription-info">
                                                <p>Период: {subscription.subscriptionPeriod} мес.</p>
                                                <p>Начало: {formatDate(subscription.startDate)}</p>
                                                <p>Окончание: {formatDate(subscription.endDate)}</p>
                                                <p>Стоимость: {subscription.totalPrice} руб.</p>
                                            </div>
                                            <div className="subscription-status status-expired">
                                                Завершена
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <UserFooter />

            {/* Модальное окно изменения периода */}
            <Modal show={showPeriodModal} onHide={() => setShowPeriodModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Изменение периода подписки</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="period-selector-modal">
                        <p>Текущий период: {selectedSubscription?.subscriptionPeriod} мес.</p>
                        <div className="period-input">
                            <label>Новый период (месяцев):</label>
                            <select 
                                value={newPeriod} 
                                onChange={(e) => setNewPeriod(Number(e.target.value))}
                            >
                                {[1, 3, 6, 12].map(period => (
                                    <option key={period} value={period}>{period}</option>
                                ))}
                            </select>
                        </div>
                        {selectedSubscription && (
                            <p className="price-info">
                                Новая стоимость: {(selectedSubscription.publication.pricePerMonth * newPeriod).toFixed(2)} руб.
                            </p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPeriodModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleUpdatePeriod}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальное окно деталей подписки */}
            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Детали подписки</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {selectedSubscription && (
                        <div className="subscription-details">
                            <div className="publication-info">
                                <div className={`publication-image-container ${
                                    newspapers.includes(selectedSubscription.publication.title) ? 'newspaper' : ''
                                }`}>
                                    <img 
                                        src={getPublicationImage(selectedSubscription.publication.title)} 
                                        alt={selectedSubscription.publication.title}
                                        className="publication-image"
                                    />
                                </div>
                                <div className="publication-text">
                                    <h3>{selectedSubscription.publication.title}</h3>
                                    <p className="description">{selectedSubscription.publication.description}</p>
                                </div>
                            </div>
                            <div className="subscription-info-detailed">
                                <div className="info-row">
                                    <span>Статус:</span>
                                    <span className={`status-badge ${selectedSubscription.active ? 'active' : 'expired'}`}>
                                        {selectedSubscription.active ? 'Активна' : 'Истекла'}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span>Дата начала:</span>
                                    <span>{formatDate(selectedSubscription.startDate)}</span>
                                </div>
                                <div className="info-row">
                                    <span>Дата окончания:</span>
                                    <span>{formatDate(selectedSubscription.endDate)}</span>
                                </div>
                                <div className="info-row">
                                    <span>Период подписки:</span>
                                    <span>{selectedSubscription.subscriptionPeriod} мес.</span>
                                </div>
                                <div className="info-row total">
                                    <span>Общая стоимость:</span>
                                    <span>{(selectedSubscription.publication.pricePerMonth * selectedSubscription.subscriptionPeriod).toFixed(2)} руб.</span>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                        Закрыть
                    </Button>
                    {selectedSubscription?.active && (
                        <Button variant="primary" onClick={() => handleEditPeriod(selectedSubscription)}>
                            Изменить период
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Profile;
