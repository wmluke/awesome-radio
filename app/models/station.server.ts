import type { Prisma, PrismaClient, Station, Tag } from "@prisma/client";
import { prisma } from "~/db.server";
import { upsertTagOnName } from "~/models/tag.server";
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

export function findStationsByTags(tags: string[]) {
    return prisma.station.findMany({
        where: {
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
        }
    });
}

export type StationWithTags = Prisma.PromiseReturnType<typeof getStationById>;

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

export function upsertStationOnStreamUrl(input: StationInput, p: PrismaTxClient = prisma) {
    return p.station.upsert({
        where: { streamUrl: input.streamUrl },
        create: {
            name: input.name,
            slug: slugify(input.name),
            description: input.description,
            imgUrl: input.imgUrl,
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
