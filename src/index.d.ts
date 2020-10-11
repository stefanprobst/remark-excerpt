import { Transformer } from 'unified'

declare namespace excerpt {
  type Options = {
    /**
     * Maximum length in characters.
     *
     * @default 140
     */
    maxLength?: number

    /**
     * Characters added when content is truncated at maxLength.
     *
     * @default "..."
     */
    ellipsis?: string

    /**
     * Truncate at word boundaries.
     *
     * @default false
     */
    preferWordBoundaries?: boolean
  }
}

declare function excerpt(options?: excerpt.Options): Transformer

export = excerpt
