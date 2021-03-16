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
 */
const razor: Razor = new Razor("https://www.amazon.com", "shoes");

(async (): Promise<void> => {
	/*
	 * @param pageLimit number; default is 1
	 */
	console.log(await razor.getProducts(2));
	// returns the products array, try to see data.
});
```

## Client

### TODO: A crawler client, maybe with puppeteer.

