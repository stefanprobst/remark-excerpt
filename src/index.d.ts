import type { Plugin } from 'unified'

export interface Options {
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

declare const excerpt: Plugin<[Options?]>

export default excerpt
