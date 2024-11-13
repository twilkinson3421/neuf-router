import type * as T from "./types.ts";
import * as h from "./helpers.ts";
import * as fs from "./fs.ts";
import { List } from "@exts/list";

/**
 * Asynchronously retrieves relative paths and URL params-data for a given request
 * @param req The request object (`Request`)
 * @param opts Router options, described by `RouterOptions`
 * @returns A promise which resolves to the path data object containing relative paths and URL params
 */
export async function router(req: Request, opts: T.RouterOptions): Promise<T.PathData> {
    const pathname = new URL(req.url).pathname;
    const segments = new List(...pathname.split("/").filter(Boolean).concat("<FILE>"));
    return await getPathData(req, segments, opts);
}

/* Note the use of the term 'factory' here refers to a function which returns a function */

async function getPathData(
    req: Request,
    segements: List<string>,
    opts: T.RouterOptions
): Promise<T.PathData> {
    const data = h.initPathData(req, opts.fsRoot);
    const rel = h.relFactory(opts.importFrom);

    for (const seg of segements.items) {
        const dir = data.paths.dir;
        const join = h.joinerFactory(dir);
        const s = await h.getStaticPaths(dir, opts.patterns);
        if (s.document) data.paths.document = rel(join(s.document));
        if (s.layout) data.paths.layouts.push(rel(join(s.layout)));
        if (s.page.notFound) data.paths.page.notFound = rel(join(s.page.notFound));
        if (s.page.error) data.paths.page.error = rel(join(s.page.error));

        if (seg.isLast && s.page.default) data.paths.page.default = rel(join(s.page.default));
        if (seg.isLast) return data;

        if (await fs.dirExists(join(seg.value))) {
            data.paths.dir = join(seg.value);
            continue;
        }

        const groupRegex = opts.patterns.dir.group;
        const groupsToDir = await h.getGroupsToDir(dir, seg.value, groupRegex, []);
        if (groupsToDir) seg.insertAfter(...groupsToDir.concat(seg.value));
        if (groupsToDir) continue;

        const dynamicPattern = opts.patterns.dir.dynamic;
        const dynamicDirName = await h.getPatternDirName(dir, dynamicPattern);
        if (dynamicDirName) {
            data.paths.dir = join(dynamicPattern.rebuild(dynamicDirName));
            data.url.params[dynamicDirName] = seg.value;
            continue;
        }

        const groupsToDynDir = await h.getGroupsToPatternDir(dir, groupRegex, dynamicPattern, []);
        if (groupsToDynDir) seg.insertAfter(...groupsToDynDir.concat(seg.value));
        if (groupsToDynDir) continue;

        const catchAllPattern = opts.patterns.dir.catchAll;
        const catchAllDirName = await h.getPatternDirName(dir, catchAllPattern);
        if (catchAllDirName) {
            data.paths.dir = join(catchAllPattern.rebuild(catchAllDirName));
            const params = [seg.value];
            while (seg.next.isNotLast) params.push(seg.extractNext()!.value);
            data.url.params[catchAllDirName] = params;
            continue;
        }

        const groupsToCADir = await h.getGroupsToPatternDir(dir, groupRegex, catchAllPattern, []);
        if (groupsToCADir) seg.insertAfter(...groupsToCADir.concat(seg.value));
        if (groupsToCADir) continue;

        return data;
    }

    return data;
}
