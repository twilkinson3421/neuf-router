export function readDir(path: string): AsyncIterable<Deno.DirEntry> {
    return Deno.readDir(path);
}

export function dirStat(path: string): Promise<Deno.FileInfo> {
    return Deno.stat(path);
}
