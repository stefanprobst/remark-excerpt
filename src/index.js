const visit = require('unist-util-visit-parents')

const MAX_LENGTH = 140
const ELLIPSIS = '...'

module.exports = attacher

function attacher(options) {
  const { maxLength = MAX_LENGTH, ellipsis = ELLIPSIS } = options || {}

  return transformer

  function transformer(tree) {
    /** top-level <!-- excerpt --> comment */
    const commentIndex = tree.children.findIndex(
      (node) =>
        node.type === 'html' && node.value.trim() === '<!-- excerpt -->',
    )

    if (commentIndex !== -1) {
      tree.children.splice(commentIndex)
      return
    }

    /** truncate at maxLength */
    let length = 0
    let excerpt
    visit(tree, 'text', visitorImmutable)
    return excerpt || tree

    function visitorImmutable(node, parents) {
      length += node.value.length

      if (length > maxLength) {
        let truncated = node.value.slice(0, maxLength - length - 1)
        let trimmed = truncated.replace(/[^\w]+$/, '')

        excerpt = { ...node, value: trimmed + ellipsis }

        let child = node
        while (parents.length > 0) {
          let parent = parents.pop()
          let index = parent.children.indexOf(child)
          excerpt = {
            ...parent,
            children: parent.children.slice(0, index).concat(excerpt),
          }
          child = parent
        }

        return visit.EXIT
      }
    }
  }
}
