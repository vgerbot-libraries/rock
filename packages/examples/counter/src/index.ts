import { App } from './App';
import { render } from 'solid-js/web';

const container = document.createElement('div');

render(App, container);

document.body.appendChild(container);
