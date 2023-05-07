import { prisma } from "~/db.server";
import type { PrismaTxClient } from "~/models/station.server";
import { slugify } from "~/utils";

export function findTagBySlug(slug: string) {
    return prisma.tag.findUnique({ where: { slug } });
}

export function upsertTagOnName(tag: string, p: PrismaTxClient = prisma) {
    const slug = slugify(tag);
    return p.tag.upsert({
        where: { name: tag },
        create: { name: tag, slug },
        update: { slug }
    });
}
