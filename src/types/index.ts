export interface Iproduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	index?: number;
}

export interface Ibuyer {
	payment: 'online' | 'cash' | '';
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export interface IBasketItem {
	index: number;
	id: string;
	title: string;
	price: number;
}

export interface IAction {
	onClick: (event: MouseEvent) => void;
}

export interface IState {
	validation?: boolean;
	errors?: string[];
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface ICatalogAPI {
    getCatalog: () => Promise<Iproduct[]>;
}

export interface ICatalog {
	catalog: Iproduct[];
}

export interface IModalData {
	content: HTMLElement;
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

export type FormErrors = Partial<Record<keyof Ibuyer, string>>;

export interface ISuccess {
    total: number;
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface IOrderForm {
	address?: string;
	email: string;
	phone: string;
}
