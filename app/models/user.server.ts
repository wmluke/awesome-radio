import type { Password, Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "~/db.server";
import type { ConvertDatesToStrings } from "~/utils";

export type { User } from "@prisma/client";
export type UserWithFavoriteStations = NonNullable<Prisma.PromiseReturnType<typeof getUserById>>;
export type UserWithFavoriteStationsClientSide = ConvertDatesToStrings<UserWithFavoriteStations>;


export async function getUserById(id: User["id"]) {
    return prisma.user.findUnique({
        where: { id },
        include: {
            favoriteStations: {
                include: { station: true }
            }
        }
    });
}

export async function getUserByEmail(email: User["email"]) {
    return prisma.user.findUnique({ where: { email } });
}

export async function createUser(email: User["email"], password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            email,
            password: {
                create: {
                    hash: hashedPassword
                }
            }
        }
    });
}

export async function deleteUserByEmail(email: User["email"]) {
    return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
    email: User["email"],
    password: Password["hash"]
) {
    const userWithPassword = await prisma.user.findUnique({
        where: { email },
        include: {
            password: true
        }
    });

    if (!userWithPassword || !userWithPassword.password) {
        return null;
    }

    const isValid = await bcrypt.compare(
        password,
        userWithPassword.password.hash
    );

    if (!isValid) {
        return null;
    }

    const { password: _password, ...userWithoutPassword } = userWithPassword;

    return userWithoutPassword;
}
