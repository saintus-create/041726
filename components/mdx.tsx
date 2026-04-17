import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { ResearchExplorer } from './research-explorer';
import { StudiesVisualizations } from './studies-visualizations';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ResearchExplorer,
    StudiesVisualizations,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}