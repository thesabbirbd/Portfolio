import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // Client-only preferences (localStorage, matchMedia, location.hash) are read after mount on
      // purpose so server HTML and the first client render match. Flag these for review instead of
      // failing the build; new code should prefer useSyncExternalStore.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Local QA tooling and the static service worker are plain Node/browser scripts.
    'scripts/**',
    'public/sw.js',
  ]),
])

export default eslintConfig
