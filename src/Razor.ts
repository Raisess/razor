import { JSDOM } from "jsdom";

import Amazon from "./services/Amazon";
import Product from "./structures/Product";

export type ProductData = {
	id:       string;
	name:     string;
	price:    number;
	stars:    number;
	uri:      string;
	__data__: Array<string>;
};

interface IRazor {
	changeSearchCategory(searchCategory: string): void;
	getProducts():                                Promise<Array<ProductData>>;
	getProduct(name: string, id: string):         Promise<ProductData | undefined>;
}

export default class Razor extends Amazon implements IRazor {
	private searchCategory: string;

	constructor(amazonUri: string, searchCategory: string) {
		super(amazonUri);

		this.searchCategory = searchCategory;
	}

	public changeSearchCategory(searchCategory: string): void {
		this.searchCategory = searchCategory;
	}

	private async getProductsSectionPageHTMLCollection(page?: number): Promise<HTMLCollection> {
		const html: string = await super.fetchPage(this.searchCategory, page);
		const dom:  JSDOM  = new JSDOM(html);

		return dom.window.document.querySelector(".s-main-slot")?.children!;
	}

	private async collectProductsData(productsSection: HTMLCollection): Promise<Array<ProductData>> {
		let products: Array<ProductData> = [];

		for (const productData of productsSection) {
			const product: Product = new Product(this.amazonUri, productData);
			
			if (product.id) {
				products.push({
					id:       product.id,
					name:     product.getName(),
					price:    product.getPrice(),
					stars:    product.getStars(),
					uri:      product.getUri(),
					__data__: product.content
				});
			}
		}

		return products;
	}

	public async getProducts(pageLimit: number = 1): Promise<Array<ProductData>> {
		let products: Array<ProductData> = [];

		// pagination solution, can be better, I think.
		for (let i: number = 1; i <= pageLimit; i++) {
			const productsSection: HTMLCollection     = await this.getProductsSectionPageHTMLCollection(i > 1 ? i : undefined);
			const tempProducts:    Array<ProductData> = await this.collectProductsData(productsSection);

			products.push(...tempProducts);
		}

		return products;
	}

	public async getProduct(): Promise<ProductData | undefined> {
		const productsCollection: HTMLCollection = await this.getProductsSectionPageHTMLCollection();

		for (const productData of productsCollection) {
			const product: Product = new Product(this.amazonUri, productData);

			if (product.content[0].toLowerCase().includes(this.searchCategory.toLowerCase())) {
				return {
					id:       product.id,
					name:     product.getName(),
					price:    product.getPrice(),
					stars:    product.getStars(),
					uri:      product.getUri(),
					__data__: product.content
				}
			}
		}

		return undefined;
	}
}

