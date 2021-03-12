import { JSDOM } from "jsdom";

import AmazonFetcher from "./services/AmazonFetcher";

export type Product = {
	name:     string;
	price:    number;
	uri:      string;
	__data__: Array<string>;
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

		let products: Array<Product> = [];

		for (const product of productsSection) {
			const productContent: Array<string> = product.textContent?.split("\n").filter((item: string): boolean => item !== "")!;
			const productDataSet: NamedNodeMap  = product.attributes;
			
			if (productDataSet.item(0)?.value) {
				let tempPrice: Array<string> | string = productContent.filter((item: string): boolean => item.includes("$"))[0];

				if (tempPrice !== undefined) {
					tempPrice = tempPrice.split("$");
					tempPrice = tempPrice[tempPrice.length - 1];
				}
				
				products.push(
					{
						name:    productContent[0],
						price:   tempPrice !== undefined ? parseFloat(tempPrice.replace(",", ".")) : 0,
						uri:     `${this.amazonUri}/${productContent[0].replace(/\s+/g, "-")}/dp/${productDataSet.item(0)?.value}`,
						__data__: productContent
					},
				);
			}
		}

		return products;
	}
}

