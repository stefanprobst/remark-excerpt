const markdown = require('remark-parse')
const toMarkdown = require('remark-stringify')
const strip = require('strip-markdown')
const unified = require('unified')
const excerpt = require('../src/index')

it('should generate excerpt with correct maxLength', async () => {
  const processor = unified()
    .use(markdown, { position: false })
    .use(excerpt, { maxLength: 27 })
    .use(strip)
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const result = await processor.process(fixture)
  expect(String(result)).toHaveLength(30) // maxLength + ellipsis length
})

it('should keep markdown in excerpt', async () => {
  const processor = unified()
    .use(markdown, { position: false })
    .use(excerpt, { maxLength: 27 })
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const result = await processor.process(fixture)
  expect(String(result)).toMatchInlineSnapshot(`
    "Lorem ipsum **dolor** sit amet...
    "
  `)
})

it('should add custom ellipsis to excerpt', async () => {
  const processor = unified()
    .use(markdown, { position: false })
    .use(excerpt, { maxLength: 27, ellipsis: '…' })
    .use(toMarkdown)

  const fixture = `Lorem ipsum **dolor** sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`

  const result = await processor.process(fixture)
  expect(String(result)).toMatchInlineSnapshot(`
    "Lorem ipsum **dolor** sit amet…
    "
  `)
})

it('should generate excerpt until excerpt comment', async () => {
  const processor = unified()
    .use(markdown, { position: false })
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
    .use(markdown, { position: false })
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
