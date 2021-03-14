import { JSDOM } from "jsdom";

import AmazonFetcher from "./services/AmazonFetcher";

export type Product = {
	id:       string;
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
	private pageLimit:      number;

	private products: Array<Product> = [];

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

	private getPrice(productContent: Array<string>): number {
		let tempPrice: string | undefined = productContent.filter((item: string): boolean => item.includes("$"))[0];

		if (tempPrice !== undefined) {
			tempPrice = tempPrice.split("$")[1];

			return parseFloat(super.isDotBr() ? tempPrice.replace(".", "").replace(",", ".") : tempPrice.replace(",", ""));
		}

		return 0;
	}

	private async collectProductsData(productsSection: HTMLCollection): Promise<void> {
		for (const product of productsSection) {
			const productDataSet: NamedNodeMap = product.attributes;

			// first value of data set is the data-asin, we are using this to be our product id, bcz this is used on amazon search, how a param.
			const productId: string | undefined = productDataSet.item(0)?.value;
			
			if (productId) {
				// remove blank data and put the rest on an array.
				const productContent: Array<string> = product.textContent?.split("\n").filter((item: string): boolean => item !== "")!;
	
				this.products.push({
					id:       productId,
					name:     productContent[0],
					price:    this.getPrice(productContent),
					uri:      `${this.amazonUri}/${productContent[0].replace(/\s+/g, "-")}/dp/${productId}`,
					__data__: productContent
				});
			}
		}
	}

	public async getProducts(): Promise<Array<Product>> {
		// pagination solution, can be better, I think.
		for (let i: number = 1; i <= this.pageLimit; i++) {
			const productsSection: HTMLCollection = await this.getProductsSectionPageHTMLCollection(i > 1 ? i : undefined);

			await this.collectProductsData(productsSection);
		}

		return this.products;
	}
}

