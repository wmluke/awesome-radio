import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
    to: FormDataEntryValue | string | null | undefined,
    defaultRedirect: string = DEFAULT_REDIRECT
) {
    if (!to || typeof to !== "string") {
        return defaultRedirect;
    }

    if (!to.startsWith("/") || to.startsWith("//")) {
        return defaultRedirect;
    }

    return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
    id: string
): Record<string, unknown> | undefined {
    const matchingRoutes = useMatches();
    const route = useMemo(
        () => matchingRoutes.find((route) => route.id === id),
        [matchingRoutes, id]
    );
    return route?.data;
}

function isUser(user: any): user is User {
    return user && typeof user === "object" && typeof user.email === "string";
}

export function useOptionalUser(): User | undefined {
    const data = useMatchesData("root");
    if (!data || !isUser(data.user)) {
        return undefined;
    }
    return data.user;
}

export function useUser(): User {
    const maybeUser = useOptionalUser();
    if (!maybeUser) {
        throw new Error(
            "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
        );
    }
    return maybeUser;
}

export function validateEmail(email: unknown): email is string {
    return typeof email === "string" && email.length > 3 && email.includes("@");
}

export function notFound(message?: string) {
    return new Response(null, {
        status: 404,
        statusText: ["Not Found", message].filter(Boolean).join(": ")
    });
}

export function createIndex<T>(records: T[], keyFn: (t: T) => string): Map<string, T> {
    return records.reduce((index, record) => {
        index.set(keyFn(record), record);
        return index;
    }, new Map<string, T>());
}

export function slugify(string: string): string {
    const a = "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
    const b = "aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
    const p = new RegExp(a.split("").join("|"), "g");

    return string.toString().toLowerCase()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, "-and-") // Replace & with 'and'
        .replace(/[^\w\-]+/g, "") // Remove all non-word characters
        .replace(/\-\-+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
}

export type ConvertDatesToStrings<T> = T extends Date
    ? string
    : T extends Array<infer U>
        ? ConvertDatesToStrings<U>[]
        : T extends object
            ? { [K in keyof T]: ConvertDatesToStrings<T[K]> }
            : T;
