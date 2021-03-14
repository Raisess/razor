import AmazonFetcher from "../services/AmazonFetcher";

interface IProduct {
	id:      string | undefined;
	content: Array<string>;

	getPrice(): number;
	getStars(): number;
	getUri():   string;
}

export default class Product extends AmazonFetcher implements IProduct {
	private dataSet: NamedNodeMap;

	public id:      string | undefined;
	public content: Array<string>;

	constructor(amazonUri: string, product: Element) {
		super(amazonUri);

		this.dataSet = product.attributes;
		this.id      = this.dataSet.item(0)?.value;
		this.content = product.textContent?.split("\n").filter((item: string): boolean => item !== "")!;
	}

	public getPrice(): number {
		let tempPrice: string | undefined = this.content.filter((item: string): boolean => item.includes("$"))[0];

		if (tempPrice !== undefined) {
			tempPrice = tempPrice.split("$")[1];

			return parseFloat(super.isDotBr() ? tempPrice.replace(".", "").replace(",", ".") : tempPrice.replace(",", ""));
		}

		return 0;
	}

	public getStars(): number {
		let tempStars: string | undefined = this.content.filter((item: string): boolean => item.includes(super.isDotBr() ? "estrelas" : "stars"))[0];

		if (tempStars !== undefined) {
			tempStars = tempStars.split(" ")[0];

			return parseFloat(super.isDotBr() ? tempStars.replace(",", ".") : tempStars);
		}

		return 0;
	}

	public getUri(): string {
		return `${this.amazonUri}/${this.content[0].replace(/\s+/g, "-")}/dp/${this.id}`;
	}
}

