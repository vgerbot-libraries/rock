import 'zx/globals';
import minimist from 'minimist';

const args = minimist(process.argv.slice(3));

const target = args.target;
const script = args.script;

if (!script) {
    throw new Error('No --script specified');
}

process.env.ROOT_DIR = path.resolve(__dirname, '..');
process.env.SCRIPT_NAME = script;
process.env.FORCE_COLOR = 3;

if (typeof target !== 'string' || !target) {
    await $`lerna exec -- zx $ROOT_DIR/scripts/$SCRIPT_NAME.mjs ${args._}`;
} else {
    const packageRootDir = path.resolve(__dirname, '../packages/', target);
    const packageJsonFile = path.resolve(packageRootDir, 'package.json');

    const { name: packageName } = fs.readJsonSync(packageJsonFile);

    process.env.PACKAGE_NAME = packageName;

    await $`lerna exec --scope=$PACKAGE_NAME -- zx $ROOT_DIR/scripts/$SCRIPT_NAME.mjs ${args._}`;
}
