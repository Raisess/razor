import Razor, { ProductData as Product } from "./Razor";

const razor: Razor = new Razor("https://www.amazon.com.br", "A Prisão do Rei");

(async (): Promise<void> => {
	//const products: Array<Product> = await razor.getProducts(2);

	const product: Product | undefined = await razor.getProduct();

	console.log(product);
})();

