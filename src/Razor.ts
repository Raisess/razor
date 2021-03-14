import { JSDOM } from "jsdom";

import AmazonFetcher from "./services/AmazonFetcher";
import Product from "./structuries/Product";

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

	getProducts(): Promise<Array<ProductData>>;
}

export default class Razor extends AmazonFetcher implements IRazor {
	private searchCategory: string;
	private pageLimit:      number;

	private products: Array<ProductData> = [];

	constructor(amazonUri: string, searchCategory: string, pageLimit: number = 1) {
		super(amazonUri);

		this.searchCategory = searchCategory;
		this.pageLimit      = pageLimit;
	}

	public changeSearchCategory(searchCategory: string): void {
		this.searchCategory = searchCategory;
	}

	private async getProductsSectionPageHTMLCollection(page?: number): Promise<HTMLCollection> {
		const html: string = await super.fetchPage(this.searchCategory, page);
		const dom:  JSDOM  = new JSDOM(html);

		return dom.window.document.querySelector(".s-main-slot")?.children!;
	}

	private async collectProductsData(productsSection: HTMLCollection): Promise<void> {
		for (const productData of productsSection) {
			const product: Product = new Product(this.amazonUri, productData);
			
			if (product.id) {
				this.products.push({
					id:       product.id,
					name:     product.content[0],
					price:    product.getPrice(),
					stars:    product.getStars(),
					uri:      product.getUri(),
					__data__: product.content
				});
			}
		}
	}

	public async getProducts(): Promise<Array<ProductData>> {
		// pagination solution, can be better, I think.
		for (let i: number = 1; i <= this.pageLimit; i++) {
			const productsSection: HTMLCollection = await this.getProductsSectionPageHTMLCollection(i > 1 ? i : undefined);

			await this.collectProductsData(productsSection);
		}

		return this.products;
	}
}

