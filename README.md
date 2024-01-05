# Solidium 

[![Work in Progress](https://img.shields.io/badge/Status-WIP-yellow?style=for-the-badge)](https://github.com/vgerbot-libraries/solidium) [![Code Style: Prettier](https://img.shields.io/badge/Code%20Style-Prettier-ff69b4?style=for-the-badge)](https://prettier.io/) [![Code Linting: ESLint](https://img.shields.io/badge/Code%20Linting-ESLint-4B32C3?style=for-the-badge)](https://eslint.org/) [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT) [![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge)](https://github.com/vgerbot-libraries/solidium) [![GitHub Issues](https://img.shields.io/github/issues/vgerbot-libraries/solidium?style=for-the-badge)](https://github.com/vgerbot-libraries/solidium/issues)



Solidium is a powerful state management library for SolidJS, designed to provide a robust and seamless integration of data and UI components. The name "Solidium" combines "Solid" from SolidJS and the suffix "ium" often associated with chemical elements, symbolizing the organic fusion between data and UI.

## Features

1. **Simplicity and Strong Extensibility:**
   Solidium is designed with simplicity in mind, ensuring ease of use and strong extensibility. It provides a straightforward and intuitive API for managing state in your SolidJS applications.

2. **IoC Container and AOP Support:**
   Solidium goes beyond basic state management by offering an Inversion of Control (IoC) container. It supports Aspect-Oriented Programming (AOP) principles and features like `IntantiationAwareProcessor`. Dependency injection and annotations are seamlessly integrated for enhanced flexibility.

3. **Code Organization and Dependency Visualization:**
   With Solidium, organizing your code becomes a breeze. The library facilitates clear dependency relationships between different modules in your application. Additionally, Solidium can generate dependency diagrams or graphs, providing a visual representation of your application's architecture.

4. **Optimized for SolidJS Performance:**
   Leveraging the outstanding features of SolidJS, Solidium is able to achieve superior performance . You can benefit from SolidJS's reactivity model and efficient rendering to build high-performance user interfaces for your applications.

## Usage

```tsx
import { Solidium, useService, Signal, Computed } from '@vgerbot/solidium';


// Define a service using Solidium

class CounterService {
    @Signal
    public count: number = 0;

    @Computed
    public get double() {
        return this.count * 2;
    }
    public increment() {
        this.count ++;
    }
}

// Main Application Component
function App() {
    return <Solidium>
            <ShowCount />
            <IncrementCount/>
        </Solidium>
}

// Component displaying count and double from CounterService
function ShowCount() {
    const service = useService(CounterService);
    return <div>
        count: {service.count}
        double: {service.double}
    </div>
}

// Component incrementing count in CounterService
function IncrementCount() {
    const service = useService(CounterService);
    return <button onClick={() => service.increment()}></button>
}
```

Explanation:

- **Reactive State with @Signal:**
    Use the `@Signal` decorator to make the `count` property of `CounterService` reactive. Any changes to `count` will automatically trigger reactivity.
- **Computed Properties with @Computed:**
    Utilize the `@Computed` decorator for the `double` property in `CounterService`. This property is automatically cached, preventing unnecessary recomputation when dependent signals remain unchanged.
- **Shared CounterService Instance:**
    Both `ShowCount` and `IncrementCount` components share the same instance of `CounterService`, obtained from the Inversion of Control (IoC) container using the `useService` hook. This ensures they operate on the same reactive state.

For detailed usage instructions, check out our [Documentation](#TODO)

## Contributing

We welcome contributions! If you find a bug or have a feature request, please open an issue. For pull requests, please follow our [contribution guidelines](#TODO).

## License

This project is licensed under the [MIT License](./LICENSE).
