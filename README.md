# remark-excerpt

[`remark`](https://remark.js.org/) transformer plugin to extract an excerpt.

## How to install

```bash
yarn add @stefanprobst/remark-excerpt
```

## How to use

The plugin creates an excerpt, which includes content until a top-level
`<!-- excerpt -->` comment. If no excerpt comment is found content will be
truncated at `maxLength`.

Examples:

```js
const remark = require('remark')
const excerpt = require('@stefanprobst/remark-excerpt')

const contentWithComment = `
This is some text.

<!-- excerpt -->

This is some more text.
`

const contentWithoutComment = `
This is some text. This is some more text.
`

const processor = remark().use(excerpt, { maxLength: 25 })

console.log(processor.processSync(contentWithComment))
// This is some text.
console.log(processor.processSync(contentWithoutComment))
// This is some text. This ...
```

## Options

- `maxLength`: truncate text at this length if no `<!-- excerpt -->` comment is
  found. defaults to 140 characters.
- `ellipsis`: if text is truncated, add this ellipsis. defaults to "...".

## Usage in a processor pipeline

It is possible to use the plugin in "bridge mode" in a `unified` processor
pipeline without truncating the original tree:

```js
const remark = require('remark')
const excerpt = require('@stefanprobst/remark-excerpt')
const bridge = require('@stefanprobst/unified-util-bridge')

const content = `
This is some text. This is some more text.
`

const excerptProcessor = remark().use(excerpt, { maxLength: 25 })
const processor = remark().use(bridge, 'excerpt', excerptProcessor)

const { data, contents } = processor.processSync(content)

console.log(contents)
// This is some text. This is some more text.
console.log(data.excerpt)
// This is some text. This ...
```
