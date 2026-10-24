import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'
import { StrategyExample } from '@/components/marketing/proof/strategy-example'

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    StrategyExample,
    ...components,
  } satisfies MDXComponents
}
