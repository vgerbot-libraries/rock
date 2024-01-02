import { OutputOptions, RollupOptions } from 'rollup';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
// const { nodeResolve } = require('@rollup/plugin-node-resolve');
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import html from '@rollup/plugin-html';
import serve from '@rollup-extras/plugin-serve';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(path.resolve(process.cwd(), 'package.json'));

const inputFile = path.resolve(process.cwd(), 'src/index.ts');

const isServingExamples =
    process.env.NODE_ENV === 'development' && pkg.name.indexOf('examples') > -1;

console.log('isServingExamples', isServingExamples);

const outputConfig = [
    [pkg.browser, 'umd'],
    [pkg.module, 'es'],
    [pkg.main, 'cjs']
]
    .filter(it => !!it[0])
    .map(confs => createOutputConfig(confs[0], confs[1]));

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

const rollupConfig: RollupOptions = {
    output: outputConfig,
    input: inputFile,
    plugins: [
        nodeResolve({
            mainFields: ['module', 'browser', 'main'],
            extensions
        }),
        commonjs({
            include: 'node_modules/**',
            ignore: [],
            sourceMap: false,
            extensions
        }),
        typescript({
            exclude: 'node_modules/**',
            tsconfig: path.resolve(process.cwd(), 'tsconfig.json')
        }),
        babel({
            extensions,
            babelHelpers: 'bundled',
            presets: ['solid', '@babel/preset-typescript'],
            exclude: /node_modules\//
        }),
        isServingExamples && html(),
        isServingExamples &&
            serve({
                port: Number(process.env.SERVE_PORT),
                dirs: 'dist'
            })
    ].filter(Boolean),
    external: isServingExamples ? [] : new RegExp('node_modules|' + pkg.name)
};

export default rollupConfig;

function createOutputConfig(
    file: string,
    format: string,
    cfg: OutputOptions = {}
): OutputOptions {
    return Object.assign(
        {
            file: path.resolve(process.cwd(), file),
            format,
            sourcemap: true,
            name: pkg.library,
            exports: 'named'
        },
        cfg || {}
    );
}
