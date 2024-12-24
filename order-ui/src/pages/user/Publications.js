import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFilter, FaSearch, FaSort } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserHeader from './Header';
import UserFooter from './Footer';
import PublicationModal from './PublicationModal';
import { useAuth } from '../../context/AuthContext';
import '../../styles/global.css';

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

// Опции сортировки
const sortOptions = [
  { value: 'title_asc', label: 'По названию (А-Я)' },
  { value: 'title_desc', label: 'По названию (Я-А)' },
  { value: 'price_asc', label: 'По цене (возрастание)' },
  { value: 'price_desc', label: 'По цене (убывание)' },
  { value: 'date_asc', label: 'По дате добавления (сначала старые)' },
  { value: 'date_desc', label: 'По дате добавления (сначала новые)' }
];

// Доступные теги
const availableTags = [
  'Наука', 'Бизнес', 'Политика', 'Экономика', 'Технологии', 
  'Культура', 'Спорт', 'Мода', 'Путешествия', 'Здоровье'
];

function UserPublications() {
  const [allPublications, setAllPublications] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    priceRange: { min: 0, max: 1000 },
    searchQuery: '',
    selectedTags: [],
    sortBy: 'title_asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const sortRef = useRef(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/publications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Ответ сервера:', response.data);

        let fetchedPublications = [];
        if (Array.isArray(response.data)) {
          fetchedPublications = response.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          fetchedPublications = response.data.content;
        } else if (response.data.publications && Array.isArray(response.data.publications)) {
          fetchedPublications = response.data.publications;
        } else {
          console.error('Неожиданный формат данных:', response.data);
          setError('Ошибка формата данных');
          return;
        }

        // Добавляем случайные теги для демонстрации
        const publicationsWithTags = fetchedPublications.map(pub => ({
          ...pub,
          tags: getRandomTags()
        }));
        
        console.log('Обработанные публикации:', publicationsWithTags);
        
        setAllPublications(publicationsWithTags);
        setFilteredPublications(publicationsWithTags);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки публикаций:', err);
        
        if (err.response) {
          console.error('Ответ с ошибкой:', err.response);
        }
        
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
        
        setError('Не удалось загрузить публикации');
        setLoading(false);
      }
    };

    fetchPublications();
  }, [navigate]);

  // Функция для получения случайных тегов (для демонстрации)
  const getRandomTags = () => {
    const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 тега
    const shuffled = [...availableTags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  };

  useEffect(() => {
    let result = [...allPublications];

    // Поиск по названию или описанию
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(pub => 
        pub.title.toLowerCase().includes(query) ||
        pub.description.toLowerCase().includes(query)
      );
    }

    // Фильтр по типу
    if (filters.type) {
      result = result.filter(pub => pub.type === filters.type);
    }

    // Фильтр по цене
    result = result.filter(pub => 
      pub.pricePerMonth >= filters.priceRange.min &&
      pub.pricePerMonth <= filters.priceRange.max
    );

    // Фильтр по тегам
    if (filters.selectedTags.length > 0) {
      result = result.filter(pub => 
        filters.selectedTags.some(tag => pub.tags.includes(tag))
      );
    }

    // Сортировка
    result = sortPublications(result, filters.sortBy);

    setFilteredPublications(result);
  }, [filters, allPublications]);

  const sortPublications = (publications, sortBy) => {
    const sorted = [...publications];
    switch (sortBy) {
      case 'title_asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title_desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'price_asc':
        return sorted.sort((a, b) => a.pricePerMonth - b.pricePerMonth);
      case 'price_desc':
        return sorted.sort((a, b) => b.pricePerMonth - a.pricePerMonth);
      case 'date_asc':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'date_desc':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted;
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFilters(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter(t => t !== tag)
        : [...prev.selectedTags, tag]
    }));
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [name]: Number(value)
      }
    }));
  };

  const openPublicationModal = (publication) => {
    setSelectedPublication(publication);
  };

  const getPublicationImage = (publication) => {
    return publicationImages[publication.title] || '/assets/default-cover.jpg';
  };

  const isNewspaper = (title) => newspapers.includes(title);

  const handleSortChange = (sortValue) => {
    setFilters(prev => ({
      ...prev,
      sortBy: sortValue
    }));
    setShowSortDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) return (
    <>
      <UserHeader />
      <div className="container">
        <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка публикаций...</div>
      </div>
      <UserFooter />
    </>
  );

  if (error) return (
    <>
      <UserHeader />
      <div className="container">
        <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>
      </div>
      <UserFooter />
    </>
  );

  return (
    <>
      <UserHeader />
      <div className="container publications-page">
        <ToastContainer />
        <div className="publications-header">
          <h1>Каталог публикаций</h1>
          <div className="publications-controls">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Поиск публикаций..." 
                name="searchQuery"
                value={filters.searchQuery}
                onChange={handleFilterChange}
              />
              <FaSearch className="search-icon" />
            </div>
            <div className="sort-container" ref={sortRef}>
              <button 
                className="sort-button"
                onClick={() => setShowSortDropdown(!showSortDropdown)}
              >
                <FaSort />
                Сортировка
              </button>
              {showSortDropdown && (
                <div className="sort-dropdown">
                  {sortOptions.map(option => (
                    <div
                      key={option.value}
                      className={`sort-option ${filters.sortBy === option.value ? 'active' : ''}`}
                      onClick={() => handleSortChange(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              Фильтры
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filter-section">
            <div className="filter-group">
              <label>Тип публикации</label>
              <select 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
              >
                <option value="">Все типы</option>
                <option value="MAGAZINE">Журнал</option>
                <option value="NEWSPAPER">Газета</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Цена от</label>
              <input 
                type="number" 
                name="min" 
                value={filters.priceRange.min}
                onChange={handlePriceRangeChange}
              />
            </div>
            <div className="filter-group">
              <label>Цена до</label>
              <input 
                type="number" 
                name="max" 
                value={filters.priceRange.max}
                onChange={handlePriceRangeChange}
              />
            </div>
            <div className="filter-group">
              <label>Теги</label>
              <div className="tags-container">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-button ${filters.selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="publications-grid">
          {filteredPublications.length > 0 ? (
            filteredPublications.map(publication => (
              <div 
                key={publication.id} 
                className="publication-card"
                onClick={() => openPublicationModal(publication)}
              >
                <div className={`publication-image-container ${publication.type === 'NEWSPAPER' ? 'newspaper' : ''}`}>
                  <img 
                    src={getPublicationImage(publication)}
                    alt={publication.title}
                    className="publication-image"
                  />
                </div>
                <div className="publication-details">
                  <h3>{publication.title}</h3>
                  <p className="publication-type">
                    {publication.type === 'MAGAZINE' ? 'Журнал' : 'Газета'}
                  </p>
                  <div className="publication-tags">
                    {publication.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <p className="publication-description">{publication.description}</p>
                  <p className="publication-price">
                    {publication.pricePerMonth} ₽ / мес
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-publications-message">
              <p>По вашему запросу публикации не найдены</p>
              <p>Попробуйте изменить параметры поиска или фильтрации</p>
            </div>
          )}
        </div>

        {selectedPublication && (
          <PublicationModal 
            publication={selectedPublication} 
            onClose={() => setSelectedPublication(null)}
          />
        )}
      </div>
      <UserFooter />
    </>
  );
}

export default UserPublications;
