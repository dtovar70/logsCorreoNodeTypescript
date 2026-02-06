
import { PrismaPg } from "@prisma/adapter-pg";
import { envs } from "./config/plugins/envs.plugin";
import { LogModel, MongoDatabase } from "./data/mongo";
import { Server } from "./presentation/server";
/* import { PrismaClient } from "@prisma/client"; */
import { PrismaClient } from "../generated/prisma";

(() => {
    main();
})();

async function main(){

    /* await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME
    }) */

  /*   const connectionString = `${process.env.POSTGRES_URL}`;  */
      
    const connectionString = `${process.env.POSTGRES_URL}`;
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    const newLog = await prisma.log_model.create({
        data: {
            level: 'HIGH',
            message: 'This is a test log from Prisma Client'
        }
    });

   const logs  = await prisma.log_model.findMany({
        where: {
            level: 'HIGH'
        }
   });

    Server.start(prisma);
}