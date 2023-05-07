import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { importSource } from "~/lib/importer.server";
import { saveSource } from "~/models/source.server";

const prisma = new PrismaClient();

async function seed() {
    const email = "testuser@foobar.com";

    // cleanup the existing database
    await prisma.user.delete({ where: { email } }).catch(() => {
        // no worries if it doesn't exist yet
    });

    const hashedPassword = await bcrypt.hash("testuser", 10);

    await prisma.user.create({
        data: {
            email,
            password: {
                create: {
                    hash: hashedPassword
                }
            }
        }
    });

    const source = {
        name: "Take Home Challenge",
        connectionUrl: "https://s3-us-west-1.amazonaws.com/cdn-web.tunein.com/stations.json",
        type: "json"
    };

    await prisma.contentSource
        .delete({
            where: { connectionUrl: source.connectionUrl }
        })
        .catch(() => {
            // no worries if it doesn't exist yet
        });

    const s = await saveSource(source);

    await importSource(s);


    console.log(`Database has been seeded. 🌱`);
}

seed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
