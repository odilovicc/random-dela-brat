import type { RouterConfig } from "nuxt/schema";
import { RouterPaths } from "~/types/router";

export default <RouterConfig>{
    routes: (_routes) => {
        return [
            {
                path: "/",
                name: RouterPaths.DASHBOARD,
                component: () => import('~/pages/index.vue'),
            },
        ];
    }
}