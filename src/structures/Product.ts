interface IProduct {
	id:      string;
	content: Array<string>;

	getPrice(): number;
	getStars(): number;
	getUri():   string;
}

export default class Product implements IProduct {
	private amazonUri:   string;
	private isProductBr: boolean;
	private dataSet:     NamedNodeMap;

	public id:      string;
	public content: Array<string>;

	constructor(amazonUri: string, product: Element) {
		this.amazonUri   = amazonUri;
		this.isProductBr = this.amazonUri.includes(".br");
		this.dataSet     = product.attributes;
		this.content     = product.textContent?.split("\n").filter((item: string): boolean => item !== "")!;
		this.id          = this.dataSet.item(0)?.value!;
	}

	public getPrice(): number {
		let tempPrice: string | undefined = this.content.filter((item: string): boolean => item.includes("$"))[0];

		if (tempPrice !== undefined) {
			tempPrice = tempPrice.split("$")[1];

			return parseFloat(this.isProductBr ? tempPrice.replace(".", "").replace(",", ".") : tempPrice.replace(",", ""));
		}

		return 0;
	}

	public getStars(): number {
		let tempStars: string | undefined = this.content.filter((item: string): boolean => item.includes(this.isProductBr ? "estrelas" : "stars"))[0];

		if (tempStars !== undefined) {
			tempStars = tempStars.split(" ")[0];

			return parseFloat(this.isProductBr ? tempStars.replace(",", ".") : tempStars);
		}

		return 0;
	}

	public getUri(): string {
		return `${this.amazonUri}/${this.content[0].replace(/\s+/g, "-")}/dp/${this.id}`;
	}
}

