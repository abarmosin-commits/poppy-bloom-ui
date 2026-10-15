---
name: "Poppy Bloom UI"
description: "Approved Figma Dashboard and Products catalogue with scoped styling; other workspaces retain the provisional analytics interface."
colors:
  canvas: "#f7f7f9"
  surface: "#ffffff"
  rail: "#f1eef5"
  text: "#282430"
  muted: "#686171"
  border: "#e6e2e9"
  control-border: "#8f8799"
  accent: "#72539a"
  accent-hover: "#604383"
  accent-soft: "#e5dced"
  accent-ink: "#52376f"
  warning: "#805a1a"
  focus: "#72539a"
typography:
  headline:
    fontFamily: "\"Segoe UI\", -apple-system, BlinkMacSystemFont, Arial, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-.025em"
  title:
    fontFamily: "\"Segoe UI\", -apple-system, BlinkMacSystemFont, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 650
    lineHeight: 1.5
    letterSpacing: "-.01em"
  body:
    fontFamily: "\"Segoe UI\", -apple-system, BlinkMacSystemFont, Arial, sans-serif"
    fontSize: ".875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "\"Segoe UI\", -apple-system, BlinkMacSystemFont, Arial, sans-serif"
    fontSize: ".75rem"
    fontWeight: 600
    lineHeight: 1.5
  metric:
    fontFamily: "\"Segoe UI\", -apple-system, BlinkMacSystemFont, Arial, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-.02em"
  dashboard-headline:
    fontFamily: "Inter, \"Segoe UI\", -apple-system, BlinkMacSystemFont, Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "44px"
  dashboard-metric:
    fontFamily: "Inter, \"Segoe UI\", -apple-system, BlinkMacSystemFont, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: "38px"
  products-headline:
    fontFamily: "Inter, \"Segoe UI\", -apple-system, BlinkMacSystemFont, Arial, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: "44px"
  products-metric:
    fontFamily: "Inter, \"Segoe UI\", -apple-system, BlinkMacSystemFont, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: "38px"
rounded:
  control: "8px"
  panel: "12px"
spacing:
  unit: "4px"
  rail: "232px"
components:
  products-summary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "16px"
  products-detail:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    padding: "24px"
    width: "416px"
  dashboard-period-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "8px 18px"
    height: "36px"
  button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "9px 16px"
  button-hover:
    backgroundColor: "{colors.accent-soft}"
  button-active:
    backgroundColor: "{colors.rail}"
  search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "46px"
    width: "254px"
  navigation-active:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.control}"
    padding: "12px"
  demo-label:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.control}"
    padding: "3px 8px"
    typography: "{typography.label}"
  working-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "24px"
---

# Design System: Poppy Bloom UI

## Overview

**Creative North Star: "Спокойный рабочий журнал"**

Светлая аналитика для ежедневного обзора магазина: спокойный системный шрифт, сливовый акцент и читаемые числовые данные. Плоскости отделяются тоном и тонкой границей; декоративные изображения и анимация отсутствуют.

Dashboard `/dashboard` реализован по утверждённому пользователем [макету Figma](https://www.figma.com/design/AUrulQ2YUoojmR0reabr7T?node-id=2-2). Утверждение ограничено этим экраном и оболочкой `.dashboard-shell`; Advertising и Finance сохраняют предварительный интерфейс. Общие токены палитры сохранены в `src/styles/tokens.css`, локальные правила Dashboard — в `src/styles/dashboard.css`. Frontmatter документирует реализацию, не создавая второй исполняемый источник токенов.

Products `/products` реализован по утверждённым [desktop 9:34](https://www.figma.com/design/AUrulQ2YUoojmR0reabr7T?node-id=9-34) (1440×900), [mobile 9:535](https://www.figma.com/design/AUrulQ2YUoojmR0reabr7T?node-id=9-535) (390px) и [fullscreen detail 9:615](https://www.figma.com/design/AUrulQ2YUoojmR0reabr7T?node-id=9-615) (390×844). Область утверждения — каталог в `.products-shell` и открываемая из него `.product-detail-panel`; отдельный маршрут `/products/:id` сохраняет прежний экран деталей. Локальные правила находятся в `src/styles/products.css`; палитра, общие токены, API и mock-источники сохранены. Dashboard остаётся без изменений.

**Key Characteristics:**
- Светлые рабочие поверхности и один сливовый акцент.
- Табличные цифры и текстовые пояснения качества данных.
- Минимум контейнеров, адаптивная навигация и горизонтальная прокрутка таблиц.

## Colors

Палитра светлая и нейтральная с приглушённым сливовым акцентом. Значения перечислены в frontmatter в исходном hex-формате.

### Primary

- **Сливовый акцент** (`accent`): линия продаж, маркер бренда, состояния взаимодействия.
- **Глубокий сливовый** (`accent-hover`, `accent-ink`): ссылки, активный текст и навигация.
- **Сливовая дымка** (`accent-soft`): активная навигация, метка демо и hover кнопок.
- **Фокус** (`focus`): контур клавиатурного фокуса; совпадает с акцентом.

### Neutral

- **Светлый фон** (`canvas`): рабочий фон, заголовки таблиц и подсветка строк.
- **Белая поверхность** (`surface`): таблицы, поля и рабочие панели.
- **Тонированная навигация** (`rail`): боковая и мобильная навигация.
- **Тёмный текст** (`text`), **приглушённый текст** (`muted`) и **граница** (`border`): основная и вторичная иерархия.
- **Предупреждение** (`warning`): служебный янтарный цвет текста о неполноте данных, не второй брендовый акцент.

**The One Accent Rule.** Сливовый цвет выделяет активную навигацию, линию графика и взаимодействие; янтарный используется только для предупреждения о данных.

## Typography

**Display Font / Body Font:** Dashboard использует локальный Inter 400/700 (`public/fonts/inter-regular.ttf`, `inter-bold.ttf`, лицензия OFL) внутри `.dashboard-shell`. Advertising, Finance и прежний экран `/products/:id` сохраняют системный Segoe UI и прежние роли frontmatter. Роли `dashboard-*` применяются только к Dashboard; его заголовок на мобильном — 26px/38px, метрика до 1199px — 22px.

Products использует те же существующие локальные Inter 400/700 внутри `.products-shell` и `.product-detail-panel`. Роли `products-*` относятся только к утверждённому каталогу: заголовок на мобильном — 26px/38px, сводные значения до 1199px — 22px, на мобильном — 22px/32px.

### Hierarchy

- **Headline:** название страницы; мобильная величина уменьшается до (1.625rem).
- **Title:** заголовок раздела.
- **Body:** строки таблицы и обычный текст.
- **Label:** метка демо; прочие вторичные подписи того же размера имеют обычный вес.
- **Metric:** крупная сумма или количество; на ширинах до (1199px) уменьшается до (1.375rem).

Размеры и интервалы ролей зафиксированы в frontmatter. Описания ограничиваются примерно (65–70ch), название товара переносится внутри ограниченной колонки.

**The Readable Figures Rule.** Числовые колонки выравниваются вправо и используют табличные цифры; отсутствие значения обозначается текстом.

## Layout

Шаг базового ритма — `spacing.unit`; реальные отступы варьируются по плотности компонента. Desktop использует фиксированную боковую навигацию шириной `spacing.rail`; верхняя полоса имеет высоту (76px). Контент ограничен (1536px), с горизонтальными полями (40px), затем (24px) до ширины (1199px).

До (959px) метрики перестраиваются из четырёх колонок в две. До (767px) боковую навигацию заменяет раскрываемое меню, верхняя полоса становится (68px), поля страницы — (20px), элементы заголовка располагаются вертикально. Мобильные поля имеют минимальную высоту (44px). Прежние табличные компоненты сохраняют минимальную ширину (730px) внутри прокручиваемой области; это не повод обрезать колонки.

Dashboard сохраняет rail 232px и desktop header 76px. Его компактная сводка имеет отступ 10px 16px 9px, график — 10px 16px; таблица сохраняет min-width 900px и горизонтальную прокрутку. Breakpoints 1199/959/767px остаются прежними; на мобильном график имеет высоту 200px вместо desktop 140px. Приведённая выше ширина таблицы 730px относится к прежним рабочим пространствам.

Products сохраняет rail (232px) и desktop header (76px). Сводка содержит пять показателей в одном контейнере; до 959px — две колонки. Desktop-таблица содержит восемь колонок и min-width (1040px) с горизонтальной прокруткой. До 767px её заменяет список: название, артикулы, выручка, заказы и текстовые статусы. Поиск занимает полную строку, статус и сортировка — следующую. Правая панель деталей имеет ширину (416px), начинается под header и прокручивается отдельно; до 767px занимает весь экран. При пустом результате на мобильном сводка скрывается.

## Elevation & Depth

Система плоская: тонкий контур (1px) и нейтральные фоновые плоскости задают границы без теней. Фокус выделяется контуром (2px) с отступом (3px); поле поиска использует отступ (2px). Явные переходы и декоративная анимация не определены, а линия графика не анимируется. Системная настройка reduced motion отключает анимации и transitions.

**The Flat Surface Rule.** Рабочие поверхности используют тон и границу; тени не являются частью базового языка.

## Shapes

Аккуратное скругление `rounded.control` объединяет поля, кнопки и навигацию; `rounded.panel` используется для рабочих поверхностей и таблиц. Небольшая круглая точка статуса сопровождается текстом. Прямые табличные разделители поддерживают чтение строк.

## Components

### Buttons

Dashboard: переключатели 1/7/30 дней с `aria-pressed`, сливовым выбранным состоянием и высотой 36px; до 767px — минимум 44px. Следующие общие размеры описывают прежние компоненты других рабочих пространств.

Белые кнопки с тонкой границей, умеренным скруглением и отступами из frontmatter. Hover тонирует поверхность сливовым, active использует фон навигации. Кнопка меню квадратная (44px); disabled снижает непрозрачность до (0.5). Клавиатурный фокус видимый. Кнопки сортировки и очистки имеют цель не меньше 44px; границы полей и кнопок используют control-border с контрастом не меньше 3:1.

### Chips

Метка демо — компактная сливовая подпись без декоративной тени; это информационная метка, а не фильтр или переключатель.

### Cards / Containers

Общие рабочие поверхности объединяют связанный контент. Панель графика имеет отступ (24px), сводка — (20px 24px 22px); на мобильном плотность уменьшается. Не дробить каждую метрику на отдельную декоративную карточку.

### Inputs / Fields

Dashboard заменяет select периода кнопками; поиск имеет фон canvas, ширину 290px и высоту 36px на desktop, на мобильном — полную ширину, оболочку 46px и ввод 16px.

Нативный select периода и строка поиска имеют белый фон, тонкую границу и мягкое скругление. Поиск показывает кнопку очистки при наличии значения; пустой результат предлагает сброс. Очистка и сброс возвращают фокус в поиск. Высота оболочки поиска — 46px, поля внутри и кнопки очистки — 44px. Ошибочные состояния полей в этом интерфейсе не реализованы и не устанавливают отдельный визуальный стандарт.

### Navigation

В Dashboard навигация текстовая: русское название сверху, английская подпись снизу, без иконок. Products также использует текстовую навигацию с русским названием и английской подписью. Advertising, Finance и прежний `/products/:id` сохраняют следующий прежний вариант.

Активная ссылка и hover используют сливовую дымку с глубоким текстом. Ссылка содержит SVG-иконку, название и вторичную подпись; иконки не заменяют текст. Мобильное раскрытие поддерживает Escape, возвращение фокуса и закрытие после выбора маршрута. При выборе уже открытого маршрута фокус также переходит в основное содержимое. Англоязычные названия рабочих пространств присутствуют в текущем коде и не устанавливают языковой стандарт продукта.

### Products catalogue and detail

Пять сводных показателей — продажи, заказы, выкуп, возвраты и выручка — сопровождаются покрытием доступных данных. Выкуп взвешивается по заказам товаров с известным выкупом и положительным числом заказов; это не среднее процентов. Сводка описывает загруженный каталог, а счётчик результатов — текущий фильтр. «Нет данных», известный 0 и «Нет заказов» остаются разными состояниями. Предупреждение и демо-формула выручки подписываются текстом.

Поиск по названию и артикулам, статус, сортировка и выбранный товар сохраняются в URL (`q`, `status`, `sort`, `product`). Неизвестные значения сортируются после известных. Выбор строки или кнопки товара открывает детали; панель удерживает фокус, закрывается по Escape и кнопке закрытия, возвращает фокус к инициатору. На мобильном есть возврат к списку. Пустой результат предлагает сброс фильтров с возвращением фокуса в поиск; загрузка и ошибка имеют отдельные состояния, ошибка — повтор.

### Data tables and chart

Dashboard объединяет компактную сводку, предупреждение о неполных данных, график и таблицу с поиском/сортировкой. Отсутствующие расходы остаются неизвестными, не нулём; янтарное предупреждение содержит текст.

Таблица использует правое выравнивание чисел, текстовые статусы и сортируемые продажи. Строки подсвечиваются нейтральным фоном при hover. График использует одну сливовую линию, нейтральную сетку, tooltip и раскрываемую таблицу точных дневных значений. Отсутствующие расходы подписываются текстом.

## Do's and Don'ts

### Do:
- Do использовать токены из src/styles/tokens.css и обновлять документацию после их изменения.
- Do сохранять видимые текстовые обозначения демо-режима и неполных данных.
- Do сохранять доступность управления с клавиатуры и прокрутку широкой таблицы на мобильном.

### Don't:
- Don't вводить второй выразительный акцент для декоративных элементов.
- Don't заменять отсутствующие данные нулём или одним цветовым сигналом.
- Don't распространять утверждения Dashboard и каталога Products на Advertising, Finance или прежний `/products/:id`; сохранённые общие токены не объявляются измеренными токенами Figma.
