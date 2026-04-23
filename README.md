# Практичне заняття: pz-SOLID
## Рефакторинг системи обробки замовлень за принципами SOLID

> Даний проєкт демонструє навички застосування SOLID принципів під час рефакторингу "анти-патерн" коду на мові TypeScript. Мета — перехід від монолітної, жорсткої архітектури до гнучкої системи, що легко розширюється та тестується.

---

## Структура проєкту

Згідно з вимогами та поточною реалізацією, проєкт має таку структуру:

```
├── src
│   ├── original          # Код із навмисними порушеннями SOLID
│   │   └── AntiSolidSystem.ts
│   ├── refactored        # Результат рефакторингу
│   │   └── OrderManagement.ts
│   └── interfaces        # Абстракції та контракти (DIP)
│       └── index.ts
├── tests
│   └── refactored.spec.ts # Unit-тести (Jest)
├── jest.config.js         # Конфігурація Jest
├── tsconfig.json          # Конфігурація TypeScript
├── package.json           # Залежності та скрипти
├── .editorconfig          # Налаштування форматування
├── .gitignore             # Виключення node_modules
└── README.md              # Звіт про виконання
```

## Аналіз порушень SOLID у вихідному коді

У файлі `src/original/AntiSolidSystem.ts` було виправлено наступні порушення:

1.  SRP (Single Responsibility Principle):
    - Клас `OrderProcessor` виконував занадто багато дій: розрахунок суми, логіку знижок, взаємодію з БД, оплату та сповіщення.
2.  OCP (Open/Closed Principle):
    - Додавання нових типів знижок вимагало модифікації існуючого методу через конструкції `if/else`, що порушує принцип закритості для змін.
3.  LSP (Liskov Substitution Principle):
    - Клас `DigitalProduct` ламав логіку базового класу `Product`, викидаючи помилку в методах, які очікували повернення числа (доставка).
4.  ISP (Interface Segregation Principle):
    - Використовувався один великий інтерфейс, який змушував класи реалізовувати непотрібну їм функціональність (наприклад, доставку для цифрових товарів).
5.  DIP (Dependency Inversion Principle):
    - Високорівневий модуль `OrderProcessor` залежав від конкретних реалізацій (`MySQLDatabase`, `StripePayment`), а не від абстракцій.

---

## Опис виконаного рефакторингу

- SRP: Логіку розрахунків винесено в `OrderCalculator`, а логіку збереження та оплати — у відповідні сервіси.
- OCP: Впроваджено патерн (Strategy) для знижок (`IDiscountStrategy`). Тепер нові типи знижок додаються як нові класи без зміни основного коду.
- LSP & ISP: Розділено інтерфейси на `IPurchasable` та `IShippable`. Цифрові товари тепер реалізують лише те, що їм потрібно.
- DIP: Усі залежності в `OrderService` передаються через конструктор як інтерфейси. Це дозволило легко підставити Mock-об'єкти під час тестування.

---

## Тестування

Для перевірки коректності рефакторингу налаштовано Jest та ts-jest.

Команди:

npm install        # Встановлення пакетів
npm run test       # Запуск тестів

Результати (Verified):

```
 npm run test

> pz-solid@1.0.0 test
> jest

 PASS  tests/refactored.spec.ts
  OrderService (Refactored SOLID)
    ✓ should process order correctly with VIP discount (3 ms)
    ✓ should throw error if payment fails (4 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.173 s
Ran all test suites.
```
---

## Acceptance Criteria Check

- Реалізація на мові Typescript.
- Кожен клас має одну відповідальність (SRP).
- Код розширюється через нові класи (OCP).
- Класи-нащадки передбачувані та заміняють базові (LSP).
- Інтерфейси вузькоспеціалізовані (ISP).
- Залежності реалізовані через абстракції (DIP).
- Усі тести проходять успішно.
