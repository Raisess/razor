import Razor, { ProductData as Product } from "./Razor";

const razor: Razor = new Razor("https://www.amazon.com.br", "dom casmurro");

(async (): Promise<void> => {
	const products: Array<Product> = await razor.getProducts();

	const product: Product = await razor.getProduct(products[0].name, products[0].id);

	console.log(product);
})();

