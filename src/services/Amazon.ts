import fetch from "node-fetch";

export default class Amazon {
	protected readonly amazonUri: string;

	constructor(amazonUri: string) {
		this.amazonUri = amazonUri;
	}

	protected async fetchSearchPage(category: string, page?: number): Promise<string> {
		const req:  any    = await fetch(`${this.amazonUri}/s?k=${category.replace(/\s+/g, "+")}&ref=nb_sb_noss${page ? "&page=" + page : ""}`);
		const html: string = await req.text();

		return html;
	}

	protected async fetchProductPage(name: string, id: string): Promise<string> {
		const req:  any    = await fetch(`${this.amazonUri}/${name}/dp/${id}`);
		const html: string = await req.text();

		return html;
	}
}

