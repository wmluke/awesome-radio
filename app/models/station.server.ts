import type { Prisma, PrismaClient, Station, Tag } from "@prisma/client";
import { prisma } from "~/db.server";
import { upsertTagOnName } from "~/models/tag.server";
import type { ConvertDatesToStrings } from "~/utils";
import { slugify } from "~/utils";

export type StationInput = {
    id?: string
    name: string;
    description: string;
    streamUrl: string;
    imgUrl: string;
    reliability: number;
    popularity: number;
    tags: string[]
};

export type PrismaTxClient = Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">;

/**
 * Fetch stations with a reliability score GTE to the `reliability` parameter.
 */
export function getStations(reliability: number = 80) {
    return prisma.station.findMany({
        where: { reliability: { gte: reliability } },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        },
        orderBy: [
            { reliability: "desc" },
            { popularity: "desc" }
        ]
    });
}

/**
 * Fetch stations tagged with `tags` and a reliability score GTE to the `reliability` parameter.
 */
export function findStationsByTags(tags: string[], reliability: number = 80) {
    return prisma.station.findMany({
        where: {
            reliability: { gte: reliability },
            tags: {
                some: {
                    tag: {
                        name: { in: tags }
                    }
                }
            }
        },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        },
        orderBy: [
            { reliability: "desc" },
            { popularity: "desc" }
        ]
    });
}

export type StationWithTags = NonNullable<Prisma.PromiseReturnType<typeof getStationById>>;
export type StationWithTagsClientSide = ConvertDatesToStrings<StationWithTags>;

export function getStationById(id: string) {
    return prisma.station.findUnique({
        where: { id },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });

}

/**
 * Performs upsert at the DB level with `ON CONFLICT`.  This is much faster than application level checks, which would require
 * several queries.
 * Note: certain criteria must be met to perform at the DB level.
 * For details, see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#database-upsert-query-criteria
 */
export function upsertStationOnStreamUrl(input: StationInput, p: PrismaTxClient = prisma) {
    return p.station.upsert({
        // only one unique field in the upsert's where option
        where: { streamUrl: input.streamUrl },
        create: {
            name: input.name,
            slug: slugify(input.name),
            description: input.description,
            imgUrl: input.imgUrl,
            // unique field in the where option and the unique field in the create option have the same value
            streamUrl: input.streamUrl,
            reliability: input.reliability,
            popularity: input.popularity
        },
        update: {
            name: input.name,
            slug: slugify(input.name),
            description: input.description,
            imgUrl: input.imgUrl,
            reliability: input.reliability,
            popularity: input.popularity
        }
    });
}

export function deleteStationTags(station: Station, p: PrismaTxClient = prisma) {
    return p.stationTag.deleteMany({ where: { stationId: station.id } });
}

export function createStationTag(station: Station, tag: Tag, p: PrismaTxClient = prisma) {
    return p.stationTag.create({
        data: {
            tagId: tag.id,
            stationId: station.id
        }
    });
}

/**
 * Import the stations in `stationsInput` by either inserting or updating the records.
 * - stations are upserted with uniqueness constraint on `streamUrl`
 * - tags are upserted with uniqueness constraint on `name`
 * - station tags are set by removing and then adding tags from each `stationInput`.
 * - we may need to revisit this approach on station tags for performance and functional
 *   requirements
 * - all writes are performed in a single transaction for performance and correctness.
 */
export async function importStations(stationsInput: StationInput[]) {
    return prisma.$transaction(async (tx) => {
        const stations: Station[] = [];
        for (const stationInput of stationsInput) {
            const station = await upsertStationOnStreamUrl(stationInput, tx);
            await deleteStationTags(station, tx);
            for (const tagName of stationInput.tags) {
                const tag = await upsertTagOnName(tagName, tx);
                await createStationTag(station, tag, tx);
            }
            stations.push(station);
        }
        return stations;
    });


}
