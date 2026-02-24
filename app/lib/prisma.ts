import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Lukka@2006",
    database: "backend",
    connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export default prisma;