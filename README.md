# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка товара

```
interface Iproduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    index?: number;
}
```

Покупатель

```
export interface Ibuyer {
    payment: 'online' | 'cash' | '';
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}
```

Интерфейс для каталога карточек

```
interface ICatalog {
    catalog: Iproduct[];
}
```

Интерфейс модального окна

```
interface IModalData {
	content: HTMLElement;
}
```

Интерфейс состояния приложения

```
interface IState {
	validation?: boolean;
	errors?: string[];
}
```

Интерфейс страницы

```
interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}
```

Интерфейс полей формы заказа

```
interface IOrderForm {
	address?: string;
	email: string;
	phone: string;
}
```

Интерфейс для состояния формы

```
interface IFormState {
	valid: boolean;
	errors: string[];
}
```

Тип для обработки ошибок формы

```
type FormErrors = Partial<Record<keyof Ibuyer, string>>;
```

Интерфейс успешного совершения заказа

```
interface ISuccess {
    total: number;
}
```

Интерфейс получения каталога карточек с сервера

```
interface ICatalogAPI {
    getCatalog: () => Promise<Iproduct[]>;
}
```

Интерфейс отправки заказа на сервер

```
interface IOrderResult {
	id: string;
	total: number;
}
```

Интерфейс корзины

```
interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}
```

Интерфейс элемента корзины

```
interface IBasketItem {
	index: number;
	id: string;
	title: string;
	price: number;
}
```

Интерфейс пользовательского действия

```
interface IAction {
	onClick: (event: MouseEvent) => void;
}
```

## Архитектура приложения

Приложение построено по принципу разделения слоев MVP.
Слой данных работает только с данными, хранит и изменяет их. Слой отображения отвечает только за
отрисовку элементов на странице. Презентер играет роль связующего звена между слоем данных и слоем
отображения.

### Базовый код

#### Класс Api

Базовый класс Api отвечает за работу с сервером. Отправляет и получает запросы. Конструктор класса `constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL сервера и глобальные опции для всех запросов (опционально).

Методы:

- `get(uri: string)` - выполняет GET запрос и возвращает ответ сервера;
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает объект с данными в формате JSON и отправляет эти данные на сервер. По умолчанию отправляется POST запрос, но если требуется другой метод, его тип можно передать третьим аргументом.
- `handleResponse(response: Response): Promise<object>` - принимает ответ сервера и возвращает промис в виде объекта в формате json, если ответ положительный, и обрабатывает ошибку в ином случае.

#### Класс CatalogAPI

Отвечает за взаимодействие с сервером. Получает данные товаров и отправляет информацию о заказе. Наследует базовый класс Api. В конструкторе принимает URL CDN для изображений, базовый URL API и опциональные настройки: `constructor(cdn: string, baseUrl: string, options?: RequestInit)`.

Методы:

- `getProduct(id: string): Promise<Iproduct>` получает данные товара по его id;
- `getCatalog(): Promise<Iproduct[]>` получает каталог товаров;
- `orderDone(order: Ibuyer): Promise<IOrderResult>` отправляет данные заказа на сервер.

#### Класс EventEmitter

Клаcc представляет собой брокер событий. Позволяет подписываться на события и отправлять события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Конструктор не принимает параметров, инициализирует внутреннюю карту событий.

Класс имплементирует интерфейс `IEvents`:

```
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

Основные методы:

- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - подписка на событие;
- `off(eventName: EventName, callback: Subscriber)` - отписка от события;
- `emit<T extends object>(eventName: string, data?: T)` - инициализация события;
- `onAll(callback: (event: EmitterEvent) => void)` - подписка на все события;
- `offAll()` - отписка от всех событий;
- `trigger<T extends object>(eventName: string, context?: Partial<T>)` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

### Слой данных (Model)

#### Класс Model

Абстрактный класс модели приложения, является дженериком и родителем класса, отвечающего за состояние приложения.
Конструктор принимает частичные данные для модели и экземпляр класса событий: `constructor(data: Partial<T>, protected events: IEvents)`.

Поля класса:

- `events: IEvents` - брокер событий.

Методы:

- `emitChanges(event: string, payload?: object)` сообщает, что модель изменилась.

#### Класс AppState

Отвечает за состояние приложения: хранит все данные приложения, реализует бизнес-логику работы с корзиной, валидации форм, подсчета суммы. Уведомляет компоненты об изменении состояния системы. Наследует абстрактный класс Model. Свойство catalog представляет собой массив объектов вида Iproduct, т.е. массив товаров. Свойство buyer это объект вида Ibuyer, который содержит в себе всю информацию о покупателе. Свойство formErrors содержит информацию об ошибках формы. Конструктор принимает начальное состояние приложения и экземпляр класса событий: `constructor(data: Partial<IState>, protected events: IEvents)`.

В полях класса хранятся следующие данные:

- `catalog: Iproduct[]` - список товаров (массив объектов товаров);
- `buyer: Ibuyer` - объект с информацией о покупателе;
- `formErrors` - список ошибок валидации форм.

Методы:

- `setCatalog(items: Iproduct[])` служит для изменения каталога товаров при загрузке с сервера и оповещает всех об изменении каталога;
- `toggleOrderItem(id: string, isIncluded: boolean)` добавляет или удаляет товар из корзины;
- `validate(): boolean` обеспечивает валидацию формы заказа;
- `validateContacts(): boolean` обеспечивает валидацию формы контактов;
- `getTotal()` возвращает итоговую сумму заказа;
- `clearBasket()` очищает корзину и сбрасывает поля заказа;
- `getCards(): Iproduct[]` возвращает массив товаров, находящихся в корзине;
- `isFilledFieldsOrder(): boolean` проверяет, все ли поля заполнены;
- `isFilledFieldsContacts(): boolean` проверяет, все ли поля заполнены;
- `setField(field: keyof IOrderForm, value: string)` устанавливает значение поля и запускает валидацию;
- `setPaymentMethod(method: 'online' | 'cash')` устанавливает способ оплаты;
- `clearFields()` очищает все поля.

### Cлой отображения (View)

Все классы отображения отвечают за отображение внутри контейнера (DOM-элемента) передаваемых в них данных.

#### Класс Component

Абстрактный класс, на основе которого создаются компоненты приложения. Является дженериком и родителем всех компонентов слоя отображения. Класс включает в себя основные инструменты для работы с DOM-элементами. Наследуется всеми классами, отвечающими за отображение. В конструктор принимает DOM-элемент контейнера компонента: `constructor(protected readonly container: HTMLElement)`. Метод render отвечает за сохранение полученных в параметре данных в полях компонентов через их сеттеры, возвращает обновленный контейнер компонента.

Методы:

- `toggleClass(element: HTMLElement, className: string, force?: boolean)` переключает класс элемента;
- `setText(element: HTMLElement, value: unknown)` устанавливает текстовое содержимое элемента;
- `setImage(element: HTMLImageElement, src: string, alt?: string)` устанавливает изображение и альтернативный текст;
- `setDisabled(element: HTMLElement, state: boolean)` изменяет статус блокировки элемента;
- `setHidden(element: HTMLElement)` , `setVisible(element: HTMLElement)` скрывают/отображают элемент;
- `render(data?: Partial<T>): HTMLElement` отрисовывает компонент.

#### Класс Page

Класс отвечает за главный контейнер приложения, основную страницу. Наследует абстрактный класс Component. Конструктор класса принимает контейнер и экземпляр класса событий для возможности инициации событий. Конструктор принимает корневой DOM-элемент страницы и экземпляр системы событий: `constructor(container: HTMLElement, protected events: IEvents)`. В конструкторе установлен слушатель на открытие корзины.

Внутри класса доступны данные:

- `_catalog: HTMLElement` - контейнер для каталога товаров;
- `_counter: HTMLElement` - контейнер для счетчика товаров в корзине;
- `_wrapper: HTMLElement` - обертка;
- `_basket: HTMLElement` - контейнер для кнопки корзины.

Сеттеры:

- `counter(value: number)` - устанавливает значение счетчика товаров;
- `catalog(items: HTMLElement[])` - устанавливает содержимое каталога на страницу;
- `locked(value: boolean)` - блокирует/разблокирует прокрутку;

#### Класс Modal

Класс отвечает за работу модальных окон. Наследует абстрактный класс Component. В конструктор принимает DOM-элемент модального окна и экземпляр класса событий: `constructor(container: HTMLElement, protected events: IEvents)`. В конструкторе класса устанавливаются слушатели на все интерактивные элементы модального окна.

Внутри класса доступны данные:

- `_closeButton: HTMLButtonElement` - кнопка закрытия модального окна;
- `_content: HTMLElement` - контейнер для содержимого.

Методы:

- `open()` открывает модальное окно;
- `close()` закрывает модальное окно;
- `_toggleModal(state: boolean = true)` переключает класс активного состояния модального окна;
- ` _handleEscape = (evt: KeyboardEvent)` - обработчик нажатия клавиши Escape;
- `render(data: IModalData): HTMLElement` переопределяется, здесь он открывает модальное окно после отрисовки.

Сеттер:

- `content(value: HTMLElement)` - устанавливает содержимое внутри модального окна.

#### Класс Form

Класс для работы с формами. Наследует абстрактный класс Component. Конструктор принимает DOM-элемент формы и экземпляр класса событий: `constructor(protected container: HTMLFormElement, protected events: IEvents)`. В конструкторе класса установлены слушатели на события ввода и отправки формы.

Внутри класса доступны:

- `_submit: HTMLButtonElement` - кнопка сабмита;
- `_errors: HTMLElement` - контейнер для текстового содержимого ошибок формы.

Методы:

- `onInputChange(field: keyof T, value: string)` - обработчик изменения полей формы;
- `render(state: Partial<T> & IFormState)` отвечает за отрисовку элемента формы.

Сеттер `valid(value: boolean)` устанавливает значение валидности формы и отвечает за активность/неактивность кнопки, `errors(value: string)` устанавливает текст ошибки.

#### Класс Order

Класс отвечает за работу с темплейтом формы заказа. Наследует класс Form. Реализует логику обработки данных заказа, включая выбор способа оплаты и ввод адреса доставки. Конструктор принимает DOM-элемент формы заказа и экземпляр класса событий: `constructor(container: HTMLFormElement, events: IEvents)`.

Внутри класса доступны:

- `_btnCash: HTMLButtonElement` - кнопка выбора оплаты наличными;
- `_btnCard: HTMLButtonElement` - кнопка выбора онлайн оплаты.

Метод `paymentChange(value: string)` обрабатывает изменение способа оплаты.
Сеттер `address(value: string)` устанавливает значение поля адреса, сеттер `payment(value: string)` устанавливает выбранный способ оплаты и меняет активность кнопок.

#### Класс Contacts

Класс отвечает за работу с формой контактов. Основные методы работы с формой наследуются, класс содержит лишь уникальные сеттеры: `phone(value: string)` для установки телефона покупателя и `email(value: string)` для установки адреса электронной почты. Конструктор принимает DOM-элемент формы контактов и экземпляр класса событий: `constructor(container: HTMLFormElement, events: IEvents)`.

#### Класс Success

Класс отвечает за отображение модального окна успешного оформления заказа. Конструктор принимает DOM-элемент контейнера и объект с действиями: `constructor(container: HTMLElement, actions: ISuccessActions)`. В конструкторе устанавливается слушатель на кнопку закрытия модального окна.

Внутри класса доступны:

- `_close: HTMLElement` - кнопка закрытия окна;
- `_total: HTMLElement` - контейнер для отображения списания итоговой суммы заказа.

Сеттер `total(total: number)` устанавливает итоговую сумму с правильным склонением.

#### Класс CardMain

Базовый класс для работы с карточками товаров. Наследует абстрактный класс Component и предоставляет общую функциональность для всех типов карточек. Конструктор принимает DOM-элемент контейнера карточки и опционально объект с действиями: `constructor(container: HTMLElement, actions?: IAction)`.

Свойства, доступные внутри класса:

- `_title: HTMLElement` - элемент заголовка карточки;
- `_price: HTMLElement` - элемент цены товара;
- `_button?: HTMLButtonElement` - опционально кнопка действия (например, "Купить");
- `_isInBasket: boolean` - свойство, указывающее находится ли товар в корзине.

Сеттеры:

- `buttonText(value: string)` устанавливает текст кнопки с использованием наследуемого метода setText;
- `title(value: string)` устанавливает заголовок карточки;
- `price(value: number | null)` устанавливает цену товара;
- `isInBasket(value: boolean)` изменяет состояние товара в корзине и обновляет текст кнопки.

Геттеры:

- `isInBasket(): boolean` возвращает текущее состояние товара (в корзине/не в корзине);
- `id(): string` возвращает ID карточки.

Метод `toggleButton(state: boolean)` - переключает состояние кнопки (активна/неактивна).

#### Класс Card

Класс отвечает за работу с данными карточки товара. Наследует класс Component. В конструктор класса передается DOM элемент темплейта и опционально действия, что позволяет при необходимости формировать карточки разных вариантов верстки: `constructor(container: HTMLElement, actions?: IAction)`. В классе устанавливается слушатель на кнопку "Купить". Собственных методов у класса нет, методы наследуются от родительского класса Component.

Свойства, доступные внутри класса:

- `_image: HTMLImageElement` - элемент картинки карточки;
- `_category: HTMLElement` - элемент категории карточки;
- `_description?: HTMLElement` - элемент описания карточки.

Сеттеры:

- `image(value: string)` - изменяет картинку карточки;
- `description(value: string | string[])` - изменяет описание карточки;
- `category(value: string)` - изменяет категорию.

#### Класс Basket

Класс отвечает за работу с данными корзины. Наследует класс Component. Конструктор класса помимо контейнера корзины принимает экземпляр `EventEmitter` для инициации событий: `constructor(container: HTMLElement, protected events: EventEmitter)`. В конструкторе класса устанавливается слушатель на кнопку "Оформить".

Внутри класса доступны:

- `_list: HTMLElement` - список товаров в корзине;
- `_total: HTMLElement` - общая сумма товаров в корзине;
- `_button: HTMLElement` - кнопка "Оформить".

Сеттеры:

- `items(items: HTMLElement[])` - изменяет список добавленных в корзину товаров, если таковые имеются, иначе создает на его месте текст "Корзина пуста";
- `selected(items: string[])` - изменяет состояние кнопки в зависимости от списка добавленных товаров;
- `total(total: number)` - изменяет общую сумму товаров в контейнере суммы.

Геттер `items(): HTMLElement[]` возвращает элементы корзины.

#### Класс BasketItem

Класс отвечает за работу с товаром из списка корзины. Наследуется от класса Component. Конструктор принимает DOM-элемент элемента корзины и опционально действия: `constructor(container: HTMLElement, act?: IAction)`. В конструкторе класса устанавливается слушатель на кнопку удаления товара.

Внутри класса доступны:

- `_index: HTMLElement` - количество товаров в корзине;
- `_buttonDelete: HTMLButtonElement` - кнопка удаления товара.

Сеттер `index(value: number)` устанавливает количество товаров в корзине.

### Слой презентера

Взаимодействие представления и данных происходит в файле `index.ts`, выполняющем роль презентера. Презентер реализован как набор обработчиков событий. Сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий. Таким образом выполняется разделение ответственности между слоями.

Основные события приложения:

- `items:changed` - изменение каталога товаров;
- `card:select` - выбор карточки товара;
- `basket:open` - открытие корзины;
- `basket:changed` - изменение содержимого корзины;
- `order:open` - открытие формы заказа;
- `order:submit` - отправка формы заказа;
- `order.payment:change` - изменение способа оплаты;
- `order.address:change` - изменение адреса доставки;
- `contacts.email:change` - изменение email;
- `contacts.phone:change` - изменение телефона;
- `contacts:open` - открытие формы контактов;
- `contacts:submit` - отправка формы контактов;
- `modal:open`- открытие модального окна;
- `modal:close` - закрытие модального окна;
- `form:errors` - ошибки валидации форм.
