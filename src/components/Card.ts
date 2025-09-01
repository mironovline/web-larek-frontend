import { Iproduct, IAction } from '../types/index';
import { ensureElement, bem } from '../utils/utils';
import { CardMain } from './CardMain';

export class Card extends CardMain<Iproduct> {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _description?: HTMLElement;

	constructor(container: HTMLElement, actions?: IAction) {
		super(container, actions);

		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._description = container.querySelector(`.card__text`);

		if (this._button) {
			this.setText(this._button, 'Купить');
		}
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}

	set category(value: string) {
		const modifier = {
			'софт-скил': 'soft',
			'хард-скил': 'hard',
			кнопка: 'button',
			другое: 'other',
			дополнительное: 'additional',
		}[value];

		if (modifier) {
			const className = bem('card', 'category', modifier).name;
			this.setText(this._category, value);
			this.toggleClass(this._category, className, true);
		}
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}
}
