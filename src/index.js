import { visitParents as visit } from 'unist-util-visit-parents'

const MAX_LENGTH = 140
const ELLIPSIS = '...'

export default function attacher(options) {
  const {
    maxLength = MAX_LENGTH,
    ellipsis = ELLIPSIS,
    preferWordBoundaries = false,
  } = options || {}

  return transformer

  function transformer(tree) {
    /** top-level <!-- excerpt --> comment */
    const commentIndex = tree.children.findIndex(
      (node) =>
        node.type === 'html' && node.value.trim() === '<!-- excerpt -->',
    )

    if (commentIndex !== -1) {
      tree.children.splice(commentIndex)
      return undefined
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
        if (preferWordBoundaries === true) {
          truncated = truncated.slice(0, truncated.lastIndexOf(' '))
        }
        const trimmed = truncated.replace(/[^\w]+$/, '')

        excerpt = { ...node, value: trimmed + ellipsis }

        let child = node
        while (parents.length > 0) {
          const parent = parents.pop()
          const index = parent.children.indexOf(child)
          excerpt = {
            ...parent,
            children: parent.children.slice(0, index).concat(excerpt),
          }
          child = parent
        }

        return visit.EXIT
      }

      return undefined
    }
  }
}
