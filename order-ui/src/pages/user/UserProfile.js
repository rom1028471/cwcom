import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import '../../styles/UserProfile.css';
import Header from '../../components/user/Header';
import Footer from '../../components/user/Footer';

function UserProfile() {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    phoneNumber: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/me');
        setUserDetails(response.data);
        setEditedDetails({
          username: response.data.username,
          email: response.data.email,
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          address: response.data.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          },
          phoneNumber: response.data.phoneNumber || ''
        });
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
        setError('Не удалось загрузить профиль');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put('http://localhost:8080/api/users/me', editedDetails);
      setUserDetails(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
      setError('Не удалось обновить профиль');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setEditedDetails(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setEditedDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return <div className="user-profile loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="user-profile error">{error}</div>;
  }

  return (
    <div className="user-profile-page">
      <Header />
      <div className="user-profile-container">
        <div className="user-profile-card">
          <h2>Профиль пользователя</h2>
          {isEditing ? (
            <div className="profile-edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Имя</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editedDetails.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Фамилия</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editedDetails.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedDetails.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Телефон</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editedDetails.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Улица</label>
                <input
                  type="text"
                  name="address.street"
                  value={editedDetails.address.street}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Город</label>
                  <input
                    type="text"
                    name="address.city"
                    value={editedDetails.address.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Регион/Область</label>
                  <input
                    type="text"
                    name="address.state"
                    value={editedDetails.address.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Почтовый индекс</label>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={editedDetails.address.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Страна</label>
                  <input
                    type="text"
                    name="address.country"
                    value={editedDetails.address.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="profile-actions">
                <button onClick={handleSaveProfile}>Сохранить</button>
                <button onClick={handleEditToggle}>Отмена</button>
              </div>
            </div>
          ) : (
            <div className="profile-details">
              <div className="profile-item">
                <strong>Имя:</strong> {userDetails.firstName || 'Не указано'}
              </div>
              <div className="profile-item">
                <strong>Фамилия:</strong> {userDetails.lastName || 'Не указано'}
              </div>
              <div className="profile-item">
                <strong>Email:</strong> {userDetails.email}
              </div>
              <div className="profile-item">
                <strong>Телефон:</strong> {userDetails.phoneNumber || 'Не указан'}
              </div>
              <div className="profile-item">
                <strong>Адрес:</strong> {userDetails.address 
                  ? `${userDetails.address.street}, ${userDetails.address.city}, 
                     ${userDetails.address.state} ${userDetails.address.zipCode}, 
                     ${userDetails.address.country}` 
                  : 'Не указан'}
              </div>
              <div className="profile-item">
                <strong>Роль:</strong> {user.role}
              </div>
              <div className="profile-actions">
                <button onClick={handleEditToggle}>Редактировать</button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserProfile;
