import { JSDOM } from "jsdom";

import AmazonFetcher from "./services/AmazonFetcher";

type Product = {
	name:  string;
	price: number;
};

interface IRazor {
	changeSearchCategory(searchCategory: string): void;

	getProducts(): Promise<Array<Product>>;
}

export default class Razor extends AmazonFetcher implements IRazor {
	private searchCategory: string;

	constructor(amazonUri: string, searchCategory: string) {
		super(amazonUri);

		this.searchCategory = searchCategory;
	}

	public changeSearchCategory(searchCategory: string): void {
		this.searchCategory = searchCategory;
	}

	private async getProductsSectionPageHTMLCollection(): Promise<HTMLCollection> {
		const html: string = await super.fetchPage(this.searchCategory);
		const dom:  JSDOM  = new JSDOM(html);

		return dom.window.document.querySelector(".s-main-slot")?.children!;
	}

	public async getProducts(): Promise<Array<Product>> {
		const productsSection: HTMLCollection = await this.getProductsSectionPageHTMLCollection();
		
		for (const product of productsSection) {
			console.log(product.textContent?.split("\n").filter((item: string) => item !== ""));
		}

		return [];
	}
}

