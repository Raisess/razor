import Razor, { Product } from "./Razor";

const razor: Razor = new Razor("https://www.amazon.com.br", "livros", 2);

razor.on("product", (product: Product): void => {
	if (product.price < 20) {
		console.log("cheap!");
	}

	console.log(product);
});

razor.on("change_page", (currentPage: number): void => {
	console.log("changed page, current page is:", currentPage);
});

