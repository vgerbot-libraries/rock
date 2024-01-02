import 'zx/globals';
import minimist from 'minimist';
const argv = minimist(process.argv.slice(2));

process.env.FORCE_COLOR = 3;

const packageFile = path.resolve(process.cwd(), 'package.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const pkg = require(packageFile);

export const cwd = process.cwd();

export { argv };
