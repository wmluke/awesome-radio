import { prisma } from "~/db.server";

export type SourceInput = {
    id?: string;
    name: string;
    description?: string;
    connectionUrl: string;
    type: string;

};

export function saveSource({ id, name, description, connectionUrl, type }: SourceInput) {
    const data = { name, description, connectionUrl, type };
    if (id) {
        return prisma.contentSource.update({
            where: { id },
            data
        });
    }
    return prisma.contentSource.create({
        data
    });
}


export function getSources() {
    return prisma.contentSource.findMany({
        orderBy: [{ name: "asc" }]
    });
}

export function getSource(id: string) {
    return prisma.contentSource.findUnique({ where: { id } });
}
