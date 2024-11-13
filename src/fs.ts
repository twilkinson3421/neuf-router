import * as a from "./adapter.ts";
import { relative } from "@std/path";

export function tryReadDir(path: string): AsyncIterable<Deno.DirEntry> | undefined {
    try {
        return a.readDir(path);
    } catch (_err) {
        return undefined;
    }
}

export function tryDirStat(path: string): Promise<Deno.FileInfo> | undefined {
    try {
        return a.dirStat(path);
    } catch (_err) {
        return undefined;
    }
}

export async function dirExists(path: string): Promise<boolean> {
    try {
        return (await a.dirStat(path)).isDirectory;
    } catch (_err) {
        return false;
    }
}

export function rel(from: string, to: string): string {
    return relative(from, to);
}
