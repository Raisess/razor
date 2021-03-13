# 🤖 Razor

Amazon products scraper, kinda a backend for web crawlers applications.

## Installing

Clone the repository.

```shell
git clone https://github.com/Raisess/razor.git
```

Enter to the project folder.

```shell
cd razor
```

Then, compile the project and run.

```shell
npm run compile | npm run start
```

## Using lib

Can you use razor, its simple.

```ts
import Razor, { Product } from "./Razor";

/*
 * @param amazonUri string
 * @param search    string
 * @param maxPages  number, default is 1
 */
const razor: Razor = new Razor("https://www.amazon.com", "shoes", 2);

razor.on("product", (product: Product): void => {
	if (product.price < 20) {
		console.log(product.name, "is cheap!");
	}

	console.log(product);
});

razor.on("change_page", (currentPage: number): void => {
	console.log("changed page, current page is:", currentPage);
});
```

## Client

### TODO: A crawler client, maybe with puppeteer.

