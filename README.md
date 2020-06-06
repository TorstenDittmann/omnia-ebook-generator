<h1 align="center">omnia-ebook-generator</h1>

<div align="center">
  <strong>Node.js ebook generator using Embedded JavaScript templating.</strong>
</div>

<br />

<div align="center">
  <sub>This library is built with ❤︎ and used by
  <a href="https://omniawrite.com">OmniaWrite</a> and
  <a href="https://github.com/torstendittmann/omnia-ebook-generator">
    contributors.
  </a>
</div>

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [API](#api)

## Features
- __easy to use:__ simple to  generator
- __clean output:__ every template meets the epub3 requirements 
- __templates:__ template system powered by EJS
- __small api:__ with only 3 methods and a single constructor there's not much to learn

## Installation
```sh
npm install omnia-ebook-generator
# or
yarn add omnia-ebook-generator
```

## How to use
```javascript
const EBook = require("omnia-ebook-generator");

const ebook = new EBook({
      title: "Title of the book", // Title
      description: "Description of the book.", // Description
      publisher: "Publisher", // Publisher
      author: "H.P. Lovecraft", // Author
      lang: "en" //2-char language code
      cover: {
        extension: "png", // File extension
        type: "image/png", // Media type
        data: "iVBORw....." // base64 string
        }
      },
      [
        {
          title: 'About the author',
          data: '<h2>Lorem Ipsum</h2>'
        },
        {
          title: 'Lorem ipsum dolor',
          data: '<p>Lorem ipsum dolor ... voluptua.</p>'
        }
      ]);

ebook.render({ use: 'modern' }); // choose template here
ebook.save('filename.epub');
```

## API
This section provides documentation on how each method works. It's intended to be a technical reference. 

### `const ebook = new EBook(opts, data)`
Initialize a new `EBook` instance. `opts` can also contain the following values:
- __opts.id:__ default: `Random UUIDv4`. Unique identifier of the book.
- __opts.title:__ default: `no title`. Title of the book.
- __opts.description:__ default: 'no description'. Description of the book.
- __opts.publisher:__ default: 'anonymous'. Listed publisher of the book.
- __opts.author:__ default: 'anonymous'. Listed author of the book.
- __opts.tocTitle:__ default: 'Table Of Contents'. Header used on the Table of Contents page.
- __opts.date:__ default: new Date().toISOString(). Creation date of the book.
- __opts.lang:__ default: 'en'. Used language in the book.
- __opts.cover:__ default: false. See cover.

#### `__opts.cover` Cover
- __opts.cover.extension:__ File extension, `png` for example.
- __opts.cover.type:__ default: false. Media type, `media/png` for example.
- __opts.cover.data:__ default: false. Base64 encoded image string.

### `ebook.render({opts})`
Renders the complete ebook and prepares it for use. 
- __opts.use:__ default: `epub3`. Template to use.
- __opts.path:__ default: `./templates`. Template directory.
- __opts.ejs:__ default: `{ rmWhitespace: true }`. EJS options object.

See [EJS options](https://github.com/mde/ejs#options) for an overview of all options.

### `ebook.save(filename)`
Saves the epub to a local path. But needs to be rendered first, see `.render()`.

### `ebook.base64()`
Returns a promise with the generated ebook and can be used like this:

```js
const data = await ebook.base64();
// or
ebook.base64().then(data => {
  console.log(data);
}
```

But needs to be rendered first, see `.render()`.

## License
[MIT](https://tldrlegal.com/license/mit-license)
