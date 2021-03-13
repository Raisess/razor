import Razor, { Product } from "./Razor";

const razor: Razor = new Razor("https://www.amazon.com.br", "dom casmurro");

razor.on("product", (product: Product): void => {
	if (product.price < 20) {
		console.log("cheap!");
	}

	console.log(product);
});

