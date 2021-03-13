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
import Razor from "./Razor";

/*
 * @param amazonUri string
 * @param search    string
 * @param maxPages  number, default is 1
 */
const razor: Razor = new Razor("https://www.amazon.com", "shoes");

razor.on("product", (product: Product): void => {
	if (product.price < 20) {
		console.log("cheap!");
	}

	console.log(product);
});
```

## Client

### TODO: A crawler client, maybe with puppeteer.

