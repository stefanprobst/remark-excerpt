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

    visit(tree, 'text', visitor)

    function visitor(node, parents) {
      length += node.value.length

      if (length > maxLength) {
        node.value = node.value.slice(0, maxLength - length - 1) + ellipsis

        let child = node
        while (parents.length > 0) {
          let parent = parents.pop()
          let index = parent.children.indexOf(child)
          parent.children.splice(index + 1)
          child = parent
        }

        return visit.EXIT
      }
    }
  }
}
