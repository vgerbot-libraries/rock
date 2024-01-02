import { pkg } from './base.mjs';

if (pkg.scripts && pkg.scripts.build) {
    await $`cross-env NODE_ENV=production npm run build`;
} else {
    if (pkg.scripts && pkg.scripts.prebuild) {
        await $`npm run prebuild`;
    }
    await $`cross-env NODE_ENV=production rollup -c $ROOT_DIR/rollup.config.js`;
}
