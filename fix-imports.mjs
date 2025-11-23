#!/usr/bin/env node

/**
 * Script to add .js extensions to all relative imports for NodeNext module resolution
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const excludeDirs = ['node_modules', 'dist', '.git'];

async function getAllTsFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
      await getAllTsFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

function fixImports(content) {
  // Match import statements with relative paths
  // This regex matches: from './path' or from "../path" or import(...) expressions

  // Fix standard imports: from './path' or from "../path"
  let fixed = content.replace(
    /from\s+(['"])(\.\.[\/\\]|\.\/)((?:(?!\1).)+)\1/g,
    (match, quote, prefix, path) => {
      // Don't add .js if it already has an extension
      if (path.match(/\.(js|json|mjs|cjs)$/)) {
        return match;
      }
      return `from ${quote}${prefix}${path}.js${quote}`;
    }
  );

  // Fix dynamic imports: import('./path') or import("../path")
  fixed = fixed.replace(
    /import\s*\(\s*(['"])(\.\.[\/\\]|\.\/)((?:(?!\1).)+)\1\s*\)/g,
    (match, quote, prefix, path) => {
      // Don't add .js if it already has an extension
      if (path.match(/\.(js|json|mjs|cjs)$/)) {
        return match;
      }
      return `import(${quote}${prefix}${path}.js${quote})`;
    }
  );

  return fixed;
}

async function main() {
  const rootDir = __dirname;
  console.log('🔧 Finding all TypeScript files...');

  const tsFiles = await getAllTsFiles(rootDir);
  console.log(`📝 Found ${tsFiles.length} TypeScript files`);

  let fixedCount = 0;

  for (const file of tsFiles) {
    const content = await readFile(file, 'utf-8');
    const fixed = fixImports(content);

    if (content !== fixed) {
      await writeFile(file, fixed, 'utf-8');
      fixedCount++;
      console.log(`✅ Fixed: ${file.replace(rootDir + '/', '')}`);
    }
  }

  console.log(`\n✨ Complete! Fixed ${fixedCount} files`);
}

main().catch(console.error);
