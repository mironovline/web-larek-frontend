import './scss/styles.scss';

import { CatalogAPI } from './components/base/CatalogAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { Iproduct, FormErrors, ICatalog } from './types';
import { AppState } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';
import { ensureElement, cloneTemplate } from './utils/utils';
import { BasketItem } from './components/BasketItem';

const events = new EventEmitter();
const api = new CatalogAPI(CDN_URL, API_URL);

// Все шаблоны
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Прочие части интерфейса
const appState = new AppState({}, events);
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contacts(cloneTemplate(contactsTemplate), events);

// Функция для обновления состояния кнопки заказа
function updateOrderButtonState() {
	const isValid = appState.isFilledFieldsOrder();
	order.valid = isValid;
}

// Функция для обновления состояния кнопки контактов
function updateContactsButtonState() {
	const isValid = appState.isFilledFieldsContacts();
	contact.valid = isValid;
}

events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Загрузка каталога
api
	.getCatalog()
	.then(appState.setCatalog.bind(appState))
	.catch((err) => {
		console.error(err);
	});

// ========== КАТАЛОГ ==========
events.on<ICatalog>('items:changed', () => {
	page.catalog = appState.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

// ========== КАРТОЧКА ТОВАРА ==========
events.on('card:select', (item: Iproduct) => {
	if (item) {
		api
			.getProduct(item.id)
			.then((res) => {
				const card = new Card(cloneTemplate(cardPreviewTemplate), {
					onClick: (evt) => {
						if (!card.isInBasket) {
							card.isInBasket = true;
							appState.toggleOrderItem(res.id, true);
							page.counter = appState.buyer.items.length;
							events.emit('basket:changed', item);
						} else {
							events.emit('basket:open', item);
						}
					},
				});
				card.isInBasket = appState.buyer.items.includes(res.id);
				modal.render({
					content: card.render({
						title: res.title,
						image: res.image,
						description: res.description,
						price: res.price,
						category: res.category,
					}),
				});
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		modal.close();
	}
});

// ========== КОРЗИНА ==========
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:changed', () => {
	const basketItems = appState.getCards();
	page.counter = appState.buyer.items.length;
	basket.total = appState.getTotal();
	basket.selected = appState.buyer.items;
	basket.items = basketItems.map((item, i) => {
		const basketItem = new BasketItem(cloneTemplate(basketCardTemplate), {
			onClick: () => {
				appState.toggleOrderItem(item.id, false);
				events.emit('basket:changed');
			},
		});
		return basketItem.render({
			id: item.id,
			title: item.title,
			price: item.price,
			index: i + 1,
		});
	});
});

// ========== ФОРМА ЗАКАЗА ==========
events.on('order:open', () => {
	order.payment = appState.buyer.payment;
	appState.validate();
	modal.render({
		content: order.render({
			address: appState.buyer.address,
			payment: appState.buyer.payment,
			valid: appState.isFilledFieldsOrder(),
			errors: [],
		}),
	});
});

// Обработчики изменений полей заказа
events.on('order.payment:change', (data: { value: 'online' | 'cash' }) => {
	appState.setPaymentMethod(data.value);
	updateOrderButtonState();
});

events.on('order.address:change', (data: { value: string }) => {
	appState.setField('address', data.value);
	updateOrderButtonState();
});

//Обработчик ошибок валидации формы заказа
events.on('form:errors', (errors: FormErrors) => {
	const orderErrors = {
		address: errors.address,
		payment: errors.payment,
	};
	order.valid = !orderErrors.address && !orderErrors.payment;
	order.errors = Object.values(orderErrors)
		.filter((i) => !!i)
		.join('; ');
});

// ========== ФОРМА КОНТАКТОВ ==========
events.on('contacts:open', () => {
	appState.validateContacts();
	modal.render({
		content: contact.render({
			email: appState.buyer.email,
			phone: appState.buyer.phone,
			valid: appState.isFilledFieldsContacts(),
			errors: [],
		}),
	});
});

// Обработчики изменений полей контактов
events.on('contacts.email:change', (data: { value: string }) => {
	appState.setField('email', data.value);
	updateContactsButtonState();
});

events.on('contacts.phone:change', (data: { value: string }) => {
	appState.setField('phone', data.value);
	updateContactsButtonState();
});

//Обработчик ошибок валидации формы контактов
events.on('form:errors', (errors: FormErrors) => {
	const contactErrors = {
		email: errors.email,
		phone: errors.phone,
	};
	contact.valid = !contactErrors.email && !contactErrors.phone;
	contact.errors = Object.values(contactErrors)
		.filter((i) => !!i)
		.join('; ');
});

// ========== ОФОРМЛЕНИЕ ЗАКАЗА ==========
// Переход от заказа к контактам
events.on('order:submit', () => {
	if (appState.validate()) {
		events.emit('contacts:open');
	}
});

events.on('contacts:submit', () => {
	if (appState.validateContacts()) {
		api
			.orderDone(appState.buyer)
			.then((result) => {
				const success = new Success(cloneTemplate(successTemplate), {
					onClick: () => {
						modal.close();
						appState.clearBasket();
						events.emit('basket:changed');
					},
				});

				modal.render({
					content: success.render({
						total: result.total,
					}),
				});
			})
			.catch((err) => {
				console.error(err);
				alert('Ошибка оформления заказа');
			});
	}
});

// ========== МОДАЛЬНОЕ ОКНО ==========
// Блокируем прокрутку страницы, если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});
// ... и разблокируем, если закрыта
events.on('modal:close', () => {
	page.locked = false;
});
