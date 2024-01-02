import { pkg, cwd, argv } from './base.mjs';

const rootDir = argv['root-dir'];
process.env['ROOT_DIR'] = rootDir;

if (pkg.scripts && pkg.scripts.build) {
    await $`cross-env NODE_ENV=production npm run build`;
} else {
    await $`cross-env NODE_ENV=production rollup -c $ROOT_DIR/rollup.config.js`;
}
