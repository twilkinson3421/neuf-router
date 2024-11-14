import type * as T from "@neuf/types/router";

/**
 * A default router options object.
 * This can be used as a starting point for your own options,
 * although you **must** still provide all of the required options.
 */
export const defaultRouterOptions: T.RouterOptions = {
    fsRoot: "src/app",
    importFrom: "src/server",
    patterns: {
        document: /^[A-Za-z0-9]+\.document\.(js|ts|jsx|tsx)$/,
        layout: /^[A-Za-z0-9]+\.layout\.(js|ts|jsx|tsx)$/,
        page: {
            default: /^[A-Za-z0-9]+\.page\.(js|ts|jsx|tsx)$/,
            notFound: /^[A-Za-z0-9]+\.page\.not-found\.(js|ts|jsx|tsx)$/,
            error: /^[A-Za-z0-9]+\.page\.error\.(js|ts|jsx|tsx)$/,
        },
        dir: {
            dynamic: {
                pattern: /^\[[^\]^\.]*\]$/,
                getName: (dirName: string) => dirName.slice(1, -1),
                rebuild: (name: string) => `[${name}]`,
            },
            catchAll: {
                pattern: /^\[\.\.\.[^\]]*\]$/,
                getName: (dirName: string) => dirName.slice(4, -1),
                rebuild: (name: string) => `[...${name}]`,
            },
            group: /^\([^\)]*\)$/,
        },
    },
};
