import type { ContentSource } from "@prisma/client";
import { fetch } from "@remix-run/node";
import { importStations } from "~/models/station.server";


export async function importSource(source: ContentSource) {
    switch (source.type) {
        case "json":
            return importRemoteJson(source);
        default:
            throw new Error("Unsupported source");

    }
}

export async function importRemoteJson(source: ContentSource) {
    const response = await fetch(source.connectionUrl);
    if (!response.ok) {
        throw new Error("Failed to fetch source");
    }
    const { data } = await response.json();
    return importStations(data);

}
