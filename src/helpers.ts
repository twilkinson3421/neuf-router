import type * as T from "./types.ts";
import * as fs from "./fs.ts";

export function initPathData(req: Request, fsRoot: string): T.PathData {
    return {
        paths: {
            dir: fsRoot,
            document: "",
            layouts: [],
            page: {
                default: undefined,
                notFound: undefined,
                error: undefined,
            },
        },
        url: {
            params: {},
            searchParams: new URLSearchParams(req.url),
        },
    };
}

export function relFactory(from: string): (to: string) => string {
    return (to: string) => fs.rel(from, to);
}

export function joinerFactory(base: string): (str: string) => string {
    return (str: string) => `${base}/${str}`;
}

async function getFile(dir: string, r: RegExp): Promise<string | undefined> {
    for await (const { name } of fs.tryReadDir(dir) ?? []) if (r.test(name)) return name;
}

export async function getStaticPaths(
    dir: string,
    patterns: T.RouterOptions["patterns"]
): Promise<T.StaticPaths> {
    return {
        document: await getFile(dir, patterns.document),
        layout: await getFile(dir, patterns.layout),
        page: {
            default: await getFile(dir, patterns.page.default),
            notFound: await getFile(dir, patterns.page.notFound),
            error: await getFile(dir, patterns.page.error),
        },
    };
}

function entryIsDirAndTest(entry: Deno.DirEntry, r: RegExp): boolean {
    return entry.isDirectory && r.test(entry.name);
}

export async function getGroupsToDir(
    path: string,
    dir: string,
    r: RegExp,
    acc: string[]
): Promise<string[] | undefined> {
    const join = joinerFactory(path);
    if (await fs.dirExists(join(dir))) return acc;
    for await (const entry of fs.tryReadDir(path) ?? []) {
        if (!entryIsDirAndTest(entry, r)) continue;
        acc.push(entry.name);
        const next = await getGroupsToDir(join(entry.name), dir, r, acc);
        if (next) return next;
    }
}

export async function getPatternDirName(
    path: string,
    p: T.RegexAndName
): Promise<string | undefined> {
    for await (const entry of fs.tryReadDir(path) ?? []) {
        if (!entryIsDirAndTest(entry, p.pattern)) continue;
        return p.getName(entry.name);
    }
}

export async function getGroupsToPatternDir(
    path: string,
    r: RegExp,
    p: T.RegexAndName,
    acc: string[]
): Promise<string[] | undefined> {
    const join = joinerFactory(path);
    if (await getPatternDirName(path, p)) return acc;
    for await (const entry of fs.tryReadDir(path) ?? []) {
        if (!entryIsDirAndTest(entry, r)) continue;
        acc.push(entry.name);
        const next = await getGroupsToPatternDir(join(entry.name), r, p, acc);
        if (next) return next;
    }
}
