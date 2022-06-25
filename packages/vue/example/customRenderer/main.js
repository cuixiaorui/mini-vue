import App from "./App.js";
import { createApp } from "./renderer.js";
import { createRootContainer } from "./game.js";

createApp(App).mount(createRootContainer());
