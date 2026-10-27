import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PROJECTS_DATA, projectHref } from './projects';

describe('projectHref', () => {
  it('prefers the MDX slug over the id', () => {
    expect(projectHref({ id: 'omnidesk-bd', slug: 'omnidesk' })).toBe('/projects/omnidesk');
    expect(projectHref({ id: 'noc-router' })).toBe('/projects/noc-router');
  });

  it('points every project at an existing case-study file', () => {
    for (const project of PROJECTS_DATA) {
      const slug = projectHref(project).replace('/projects/', '');
      const file = path.join(process.cwd(), 'content/projects', `${slug}.mdx`);
      expect(fs.existsSync(file), `${project.title} -> ${slug}.mdx`).toBe(true);
    }
  });
});
