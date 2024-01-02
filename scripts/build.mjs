import { pkg } from './base.mjs';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

if (pkg.scripts && pkg.scripts.build) {
    await $`npm run build`;
} else {
    if (pkg.scripts && pkg.scripts.prebuild) {
        await $`npm run prebuild`;
    }
    await $`rollup -c $ROOT_DIR/rollup.config.js`;
}
