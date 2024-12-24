package com.roomih.orderapi.runner;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.roomih.orderapi.model.*;
import com.roomih.orderapi.repository.*;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PublicationRepository publicationRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Начало инициализации базы данных...");
            initializeUsers();
            log.info("Пользователи созданы");
            initializePublications();
            log.info("Публикации созданы. Всего: {}", publicationRepository.count());
            initializeSubscriptions();
            log.info("Подписки созданы");
            initializeCarts();
            log.info("Корзины созданы");
            log.info("Инициализация базы данных завершена");
        }
    }

    private void initializeUsers() {
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        User user = new User();
        user.setName("User");
        user.setEmail("user@example.com");
        user.setPassword(passwordEncoder.encode("user"));
        user.setRole("USER");
        userRepository.save(user);
    }

    private void initializePublications() {
        log.info("Начало создания публикаций...");
        
        // Журналы
        createPublication(
            "National Geographic",
            "Всемирно известный научно-популярный журнал о природе, науке, культуре и путешес��виях",
            "В этом выпуске:\n\n" +
            "• Тайны глубин: Исследование Марианской впадины\n" +
            "• Последние племена Амазонии: Жизнь вне цивилизации\n" +
            "• Климатические изменения: Новые данные с Северного полюса\n" +
            "• Фотогалерея: Редкие виды животных Африки\n" +
            "• Специальный репортаж: Древние цивилизации Южной Америки",
            299.99,
            PublicationType.MAGAZINE
        );
        
        createPublication(
            "Nature",
            "Один из самых старых и авторитетных научных журналов",
            "ОСНОВНЫЕ ТЕМЫ ВЫПУСКА:\n\n" +
            "• Революция в редактировании генов\n" +
            "  - Новые инструменты CRISPR\n" +
            "  - Этические вопросы генной инженерии\n\n" +
            "• Искусственный интеллект в медицине\n" +
            "  - Диагностика заболеваний\n" +
            "  - Разработка лекарств\n\n" +
            "• Изменение климата: новые данные\n" +
            "  - Таяние ледников\n" +
            "  - Прогнозы на будущее\n\n" +
            "ТАКЖЕ В НОМЕРЕ:\n" +
            "• Новости науки\n" +
            "• Письма читателей\n" +
            "• Рецензии на научные работы",
            399.99,
            PublicationType.MAGAZINE
        );

        createPublication(
            "New Scientist",
            "Еженедельный научно-популярный журнал",
            "Еженедельный научно-популярный журнал",
            249.99,
            PublicationType.MAGAZINE
        );

        createPublication(
            "Scientific American",
            "Научно-популярный журнал, освещающий новости науки и техники",
            "Научно-популярный журнал, освещающий новости науки и техники",
            249.99,
            PublicationType.MAGAZINE
        );

        createPublication(
            "Science",
            "Ведущий научный журнал Американской ассоциации содействия развитию науки",
            "Содержание выпуска:\n\n" +
            "• Прорыв в квантовых вычислениях: Новая эра компьютеров\n" +
            "• Исследование стволовых клеток: Перспективы в медицине\n" +
            "• Астрофизика: Обнаружение новой экзопланеты\n" +
            "• Генетика: Расшифровка древней ДНК\n" +
            "• Нейробиология: Как мозг формирует воспоминания",
            349.99,
            PublicationType.MAGAZINE
        );

        createPublication(
            "The Economist",
            "Еженедельный журнал новостей, международных отношений и экономики",
            "В ЭТОМ НОМЕРЕ:\n\n" +
            "МИРОВАЯ ЭКОНОМИКА:\n" +
            "• Новый экономический порядок\n" +
            "  - Анализ глобальных трендов\n" +
            "  - Прогнозы развития рынков\n\n" +
            "ТЕХНОЛОГИИ:\n" +
            "• Будущее криптовалют\n" +
            "• Инновации в энергетике\n\n" +
            "ПОЛИТИКА:\n" +
            "• Геополитические изменения\n" +
            "• Международные отношения\n\n" +
            "БИЗНЕС:\n" +
            "• Стартапы года\n" +
            "• Корпоративные стратегии",
            299.99,
            PublicationType.MAGAZINE
        );

        createPublication(
            "Forbes",
            "Американский финансово-экономический журнал",
            "ГЛАВНЫЕ ТЕМЫ:\n\n" +
            "• Рейтинг миллиардеров 2024\n" +
            "  - Новые лица в списке\n" +
            "  - Истории успеха\n\n" +
            "• Технологические тренды\n" +
            "  - Искусственный интеллект\n" +
            "  - Зеленые технологии\n\n" +
            "• Инвестиции\n" +
            "  - Советы экспертов\n" +
            "  - Анализ рынков\n\n" +
            "• Предприниматели года",
            199.99,
            PublicationType.MAGAZINE
        );

        createPublication(
            "TIME",
            "Еженедельный новостной журнал",
            "Еженедельный новостной журнал",
            149.99,
            PublicationType.MAGAZINE
        );

        // Газеты
        createPublication(
            "The New York Times",
            "Ежедневная американская газета с мировым влиянием",
            "Ежедневная американская газета с мировым влиянием",
            199.99,
            PublicationType.NEWSPAPER
        );

        createPublication(
            "The Wall Street Journal",
            "Ведущая деловая газета с фокусом на финансовые новости",
            "СЕГОДНЯ В ВЫПУСКЕ:\n\n" +
            "ФИНАНСЫ:\n" +
            "• Анализ фондового рынка\n" +
            "• Банковский сектор\n\n" +
            "БИЗНЕС:\n" +
            "• Корпоративные новости\n" +
            "• Сделки и поглощения\n\n" +
            "ТЕХНОЛОГИИ:\n" +
            "• Новости технологического сектора\n" +
            "• Стартапы и инновации\n\n" +
            "АНАЛИТИКА И МНЕНИЯ",
            249.99,
            PublicationType.NEWSPAPER
        );

        createPublication(
            "The Washington Post",
            "Ежедневная газета с глубоким освещением политических новостей",
            "Ежедневная газета с глубоким освещением политических новостей",
            199.99,
            PublicationType.NEWSPAPER
        );

        log.info("Публикации созданы успешно. Количество: {}", publicationRepository.count());
    }

    private Publication createPublication(String title, String description, String content, Double price, PublicationType type) {
        Publication publication = new Publication();
        publication.setTitle(title);
        publication.setDescription(description);
        publication.setContent(content);
        publication.setPricePerMonth(price);
        publication.setType(type);
        Publication saved = publicationRepository.save(publication);
        log.info("Создана публикация: {} ({})", title, type);
        return saved;
    }

    private void initializeSubscriptions() {
        User user = userRepository.findByEmail("user@example.com").orElseThrow();
        Publication publication = publicationRepository.findAll().get(0);

        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPublication(publication);
        subscription.setStartDate(LocalDateTime.now().minusMonths(1));
        subscription.setEndDate(LocalDateTime.now().plusMonths(2));
        subscription.setSubscriptionPeriod(3);
        subscription.setTotalPrice(publication.getPricePerMonth() * 3);
        subscription.setActive(true);
        subscriptionRepository.save(subscription);
    }

    private void initializeCarts() {
        User user = userRepository.findByEmail("user@example.com").orElseThrow();
        Publication publication = publicationRepository.findAll().get(0);

        Cart cart = new Cart();
        cart.setUser(user);
        cart = cartRepository.save(cart);

        CartItem cartItem = new CartItem();
        cartItem.setCart(cart);
        cartItem.setPublication(publication);
        cartItem.setSubscriptionPeriod(1);
        cartItem.setTotalPrice((float)(publication.getPricePerMonth() * 1));
        cartItemRepository.save(cartItem);
    }
}
