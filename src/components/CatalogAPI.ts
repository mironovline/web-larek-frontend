import { Api, ApiListResponse } from './base/api';
import { Iproduct, Ibuyer, IOrderResult, ICatalogAPI } from '../types';

export class CatalogAPI extends Api implements ICatalogAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}
	//получить товар
	getProduct(id: string): Promise<Iproduct> {
		return this.get(`/product/${id}`).then((item: Iproduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}
	//получить каталог товаров
	getCatalog(): Promise<Iproduct[]> {
		return this.get('/product').then((data: ApiListResponse<Iproduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}
	orderDone(order: Ibuyer): Promise<IOrderResult> {
		return this.post('/order', order).then((data: IOrderResult) => data);
	}
}
