export interface RouterOptions {
    /** The root directory where the router will look for files. */
    fsRoot: string;
    /** The directory containing the file which will import the files. */
    importFrom: string;
    patterns: {
        /** A regular expression which is used to match the document file. */
        document: RegExp;
        /** A regular expression which is used to match the layout file. */
        layout: RegExp;
        page: {
            /** A regular expression which is used to match the default page file. */
            default: RegExp;
            /** A regular expression which is used to match the not found page file. */
            notFound: RegExp;
            /** A regular expression which is used to match the error page file. */
            error: RegExp;
        };
        dir: {
            dynamic: RegexAndName;
            catchAll: RegexAndName;
            /** A regular expression which is used to match a group directory. */
            group: RegExp;
        };
    };
}

export interface RegexAndName {
    /** A regular expression which is used to match a directory. */
    pattern: RegExp;
    /** A function which takes a full directory name and returns the name of the directory. */
    getName: (dirName: string) => string;
    /** A function which takes the name of the directory and returns the full directory name as it appears in the file system. */
    rebuild: (name: string) => string;
}

export interface PathData {
    paths: {
        dir: string;
        document: string;
        layouts: string[];
        page: {
            default: string | undefined;
            notFound: string | undefined;
            error: string | undefined;
        };
    };
    url: {
        params: Params;
        searchParams: URLSearchParams;
    };
}

export type Params<T extends Record<string, unknown> = Record<string, unknown>> = T;

export interface StaticPaths {
    document: string | undefined;
    layout: string | undefined;
    page: {
        default: string | undefined;
        notFound: string | undefined;
        error: string | undefined;
    };
}
