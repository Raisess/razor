import fetch from "node-fetch";

export default class AmazonFetcher {
	private readonly amazonUri: string;

	constructor(amazonUri: string) {
		this.amazonUri = amazonUri;
	}

	protected async fetchPage(category: string): Promise<string> {
		const req:  any    = await fetch(`${this.amazonUri}/s?k=${category}&ref=nb_sb_noss`);
		const html: string = await req.text();

		return html;
	}
}

