import {App, defineAsyncComponent} from "vue";
import { getComponentNameByPath } from "@qomo-platform/core";

//组件
const components = Object.assign(
    {},
    import.meta.glob('/src/stateComponents/**/*.(vue|tsx|jsx)'),
);

const StateComponents = {
    install(app: App) {
        Object.entries(components).map(([componentPath, component]) => app.component(getComponentNameByPath(componentPath), defineAsyncComponent(component)))
    },
}
export default StateComponents;

