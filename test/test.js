import fromMarkdown from 'remark-parse'
import toMarkdown from 'remark-stringify'
import strip from 'strip-markdown'
import { unified } from 'unified'

import excerpt from '../src'

it('should generate excerpt with correct maxLength', async () => {
  const processor = unified()
    .use(fromMarkdown, { position: false })
    .use(excerpt, { maxLength: 27 })
    .use(strip)
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\n\nStet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const result = await processor.process(fixture)
  expect(String(result)).toHaveLength(30) // maxLength + ellipsis length
})

it('should keep markdown in excerpt', async () => {
  const processor = unified()
    .use(fromMarkdown, { position: false })
    .use(excerpt, { maxLength: 27 })
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\n\nStet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const result = await processor.process(fixture)
  expect(String(result)).toMatchInlineSnapshot(`
    "Lorem ipsum **dolor** sit amet...
    "
  `)
})

it('should trim trailing whitespace in excerpt', async () => {
  const processor = unified()
    .use(fromMarkdown, { position: false })
    .use(excerpt, { maxLength: 23 })
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\n\nStet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const result = await processor.process(fixture)
  expect(String(result)).toMatchInlineSnapshot(`
    "Lorem ipsum **dolor** sit...
    "
  `)
})

it('should trim trailing punctuation in excerpt', async () => {
  const processor = unified()
    .use(fromMarkdown, { position: false })
    .use(excerpt, { maxLength: 28 })
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\n\nStet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const result = await processor.process(fixture)
  expect(String(result)).toMatchInlineSnapshot(`
    "Lorem ipsum **dolor** sit amet...
    "
  `)
})

it('should optionally truncate at word boundaries', async () => {
  const processor = unified()
    .use(fromMarkdown, { position: false })
    .use(excerpt, { maxLength: 25, preferWordBoundaries: true })
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\n\nStet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const result = await processor.process(fixture)
  expect(String(result)).toMatchInlineSnapshot(`
    "Lorem ipsum **dolor** sit...
    "
  `)
})

it('should add custom ellipsis to excerpt', async () => {
  const processor = unified()
    .use(fromMarkdown, { position: false })
    .use(excerpt, { maxLength: 27, ellipsis: '…' })
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\n\nStet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const result = await processor.process(fixture)
  expect(String(result)).toMatchInlineSnapshot(`
    "Lorem ipsum **dolor** sit amet…
    "
  `)
})

it('should generate excerpt until excerpt comment', async () => {
  const processor = unified()
    .use(fromMarkdown, { position: false })
    .use(excerpt, { maxLength: 27 })
    .use(strip)
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit

  <!-- excerpt -->

  amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const result = await processor.process(fixture)
  expect(String(result)).toMatchInlineSnapshot(`
    "Lorem ipsum dolor sit
    "
  `)
})

it('should use excerpt comment when after maxLength', async () => {
  const processor = unified()
    .use(fromMarkdown, { position: false })
    .use(excerpt, { maxLength: 27 })
    .use(strip)
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit amet, consetetur

  <!-- excerpt -->

  sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const result = await processor.process(fixture)
  expect(String(result)).toMatchInlineSnapshot(`
    "Lorem ipsum dolor sit amet, consetetur
    "
  `)
})

it('should not truncate original tree', async () => {
  const processor = unified()
    .use(fromMarkdown, { position: false })
    .use(function bridge() {
      return transformer
      function transformer(tree, file, next) {
        const processor = unified()
          .use(excerpt, { maxLength: 27 })
          .use(strip)
          .use(toMarkdown)
        processor.run(tree, function done(err, ast) {
          file.data.excerpt = processor.stringify(ast)
          next(err)
        })
      }
    })
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const file = await processor.process(fixture)
  expect(String(file)).toMatchInlineSnapshot(`
    "Lorem ipsum **dolor** sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
    "
  `)
  expect(file.data).toMatchInlineSnapshot(`
    Object {
      "excerpt": "Lorem ipsum dolor sit amet...
    ",
    }
  `)
})
