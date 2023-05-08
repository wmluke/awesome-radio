import type { Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import type { PrismaTxClient } from "~/models/station.server";
import type { ConvertDatesToStrings } from "~/utils";
import { slugify } from "~/utils";

export type TagWithStations = NonNullable<Prisma.PromiseReturnType<typeof findTagBySlug>>;
export type TagWithStationsClientSide = ConvertDatesToStrings<TagWithStations>;


export function findTagBySlug(slug: string, reliability = 80) {
    return prisma.tag.findUnique({
        where: { slug },
        include: {
            stations: {
                where: {
                    station: {
                        reliability: {
                            gte: reliability
                        }
                    }
                },
                include: {
                    station: true
                }
            }
        }
    });
}

export function getTags(reliability = 80) {
    return prisma.tag.findMany({
        include: {
            stations: {
                where: {
                    station: {
                        reliability: {
                            gte: reliability
                        }
                    }
                },
                include: {
                    station: true
                }
            }
        },
        orderBy: {
            name: "asc"
        }
    });
}

/**
 * Performs upsert at the DB level with `ON CONFLICT`.  This is much faster than application level checks, which would require
 * several queries.
 * Note: certain criteria must be met to perform at the DB level.
 * For details, see https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#database-upsert-query-criteria
 */
export function upsertTagOnName(tag: string, p: PrismaTxClient = prisma) {
    const slug = slugify(tag);
    return p.tag.upsert({
        where: { name: tag },
        create: { name: tag, slug },
        update: { slug }
    });
}
