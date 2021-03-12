import Razor, { Product } from "./Razor";

const razor: Razor = new Razor("https://www.amazon.com.br", "dom casmurro");

(async (): Promise<void> => {
	const products: Array<Product> = await razor.getProducts();

	console.log(products);
})();

