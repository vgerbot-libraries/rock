# rollup-jest-boilerplate (monorepo)

A monorepo starter template for building TypeScript projects using Learna, Rollup, Jest, zx, Istanbul and codecov.

## 🚀 Getting started

To get started, clone the repository and install the dependencis using npm.

```bash
git clone https://github.com/vgerbot-libraries/rock.git --branch monorepo
cd rollup-jest-boilerplate
npm install
```

## 💻 Available Scripts

In the project directory, you can run the following npm commands:

### `npm run build`

Builds the packages in the monorepo for production and outputs the files to the respective `dist` folders.

### `npm run test`

Runs the Jest test suite to check the code quality and ensure that everything is working as expected. It also generates test coverage reports using Istanbul and integrates with Codecov to show the code coverage.

### `npm run lint`

Lints the code using ESLint and Commitlint to ensure that the code is written according to best practices.

### `npm run format`

Formats the code using Prettier to ensure that the code is clean, readable, and consistent.

### `npm run gendoc`

Generates documentation for the packages in the monorepo using TypeDoc.

## 🛠️ Technologies Used

- Rollup: A module bundler for JavaScript, used to build and package the packages in the monorepo.
- Jest: A JavaScript testing framework, used to write and run tests for the packages.
- Husky: A Git hooks manager, used to run scripts when certain Git events occur, such as committing code.
- Istanbul: A code coverage tool, used to generate coverage reports for the tests.
- Commitlint: A linting tool for commit messages, used to enforce a consistent commit message format.
- ESLint: A linting tool for JavaScript, used to enforce coding style and best practices.
- ZX: A tool for writing better scripts.
- Lerna: A monorepo management tool, used to manage the packages in the monorepo and their dependencies.
- TypeDoc: A documentation generator for TypeScript, used to generate documentation for the packages.
- codecov: A code coverage uploader, used to upload the test coverage to Codecov platform for processing.

## 📃 License

This project is licensed under the MIT License.
