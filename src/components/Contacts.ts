import { Form } from './Form';
import { Ibuyer } from '../types';

export class Contacts extends Form<Partial<Ibuyer>> {
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}
