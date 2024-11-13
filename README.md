# @neuf/router

A configurable router for Deno. Could be easily forked and ported to Node. Designed to be injectable into an http server. Created for use with [neuf](https://jsr.io/@neuf/neuf).

## Usage

A simple example of how the router can be used to handle a request.

```ts
import { router } from "jsr:@neuf/router";

const myHandler = async (req: Request) => {
  const pathData = await router(req, myRouterOptions);

  const pagePath = pathData.paths.page.default ?? pathData.paths.page.notFound;
  if (!pagePath) return new Response("Not Found", { status: 404 });

  const page = await import(pagePath);
  const doc = await import(pathData.paths.document);
  const layouts = pathData.paths.layouts.map(async layout => await import(layout));
};
```

## Options

The router options are used to configure the router behaviour. A default router options object is provided (`defaultRouterOptions`), which can be used as a starting point for your own options, although you **must** still provide all of the required options.

- `fsRoot`: The root directory where the router will look for files.
- `importFrom`: The directory containing the file which will import the files.
- `patterns`:
  - `document`: A regular expression which is used to match the document file.
  - `layout`: A regular expression which is used to match the layout file.
  - `page`:
    - `default`: A regular expression which is used to match the default page file.
    - `notFound`: A regular expression which is used to match the not found page file.
    - `error`: A regular expression which is used to match the error page file.
  - `dir`:
    - `dynamic`:
      - `pattern`: A regular expression which is used to match a dynamic directory.
      - `getName`: A function which takes a full directory name and returns the name of the dynamic directory.
      - `rebuild`: A function which takes the name of the dynamic directory and returns the full directory name as it appears in the file system.
    - `catchAll`:
      - `pattern`: A regular expression which is used to match a catch all directory.
      - `getName`: A function which takes a full directory name and returns the name of the catch all directory.
      - `rebuild`: A function which takes the name of the catch all directory and returns the full directory name as it appears in the file system.
    - `group`: A regular expression which is used to match a group directory.

## License

[MIT](LICENSE)
