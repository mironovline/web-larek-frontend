import { Model } from './base/Model';
import { Iproduct, Ibuyer, IState, IOrderForm, FormErrors } from '../types';

export class AppState extends Model<IState> {
	catalog: Iproduct[];
	buyer: Ibuyer = {
		email: '',
		phone: '',
		address: '',
		payment: '',
		total: null,
		items: [],
	};

	formErrors: FormErrors = {};

	setCatalog(items: Iproduct[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	toggleOrderItem(id: string, isIncluded: boolean) {
		if (isIncluded) {
			if (!this.buyer.items.includes(id)) {
				this.buyer.items = [...this.buyer.items, id];
			}
		} else {
			this.buyer.items = this.buyer.items.filter((itemId) => itemId !== id);
		}

		this.emitChanges('basket:changed', { items: this.buyer.items });
	}

	clearBasket() {
		this.buyer.items.forEach((id) => this.toggleOrderItem(id, false));
		this.clearFields();
		this.emitChanges('basket:changed', { order: this.buyer });
	}

	getTotal() {
		return (this.buyer.total = this.buyer.items.reduce(
			(a, c) => a + Number(this.catalog.find((it) => it.id === c)?.price || 0),
			0
		));
	}

	getCards(): Iproduct[] {
		return this.catalog.filter((item) => this.buyer.items.includes(item.id));
	}

	isFilledFieldsOrder(): boolean {
		return !!this.buyer.address && !!this.buyer.payment;
	}

	isFilledFieldsContacts(): boolean {
		return !!this.buyer.email && !!this.buyer.phone;
	}

	clearFields() {
		this.buyer.email = '';
		this.buyer.address = '';
		this.buyer.payment = '';
		this.buyer.phone = '';
	}

	setField(field: keyof IOrderForm, value: string) {
		this.buyer[field] = value;

		if (['address', 'payment'].includes(field)) {
			this.validate();
		}

		if (['email', 'phone'].includes(field)) {
			this.validateContacts();
		}
	}

	setPaymentMethod(method: 'online' | 'cash') {
		this.buyer.payment = method;
		this.validate();
		this.emitChanges('payment:changed', { payment: method });
	}

	validate(): boolean {
		const errors: FormErrors = {};
		if (!this.buyer.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.buyer.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('form:errors', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts(): boolean {
		const errors: FormErrors = {};
		if (!this.buyer.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.buyer.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.formErrors = errors;
		this.events.emit('form:errors', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
