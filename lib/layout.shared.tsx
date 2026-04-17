import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  const githubUrl = gitConfig
    ? 'https://github.com/' + gitConfig.user + '/' + gitConfig.repo
    : undefined;

  return {
    nav: {
      title: appName,
    },
    githubUrl,
  };
}