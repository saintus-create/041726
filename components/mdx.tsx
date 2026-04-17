import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { ResearchExplorer } from './research-explorer';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ResearchExplorer,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
