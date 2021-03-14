import fetch from "node-fetch";

export default class Amazon {
	protected readonly amazonUri: string;

	constructor(amazonUri: string) {
		this.amazonUri = amazonUri;
	}

	protected isDotBr(): boolean {
		return this.amazonUri.includes(".br");
	}

	protected async fetchPage(category: string, page?: number): Promise<string> {
		const req:  any    = await fetch(`${this.amazonUri}/s?k=${category.replace(/\s+/g, "+")}&ref=nb_sb_noss${page ? "&page=" + page : ""}`);
		const html: string = await req.text();

		return html;
	}
}

