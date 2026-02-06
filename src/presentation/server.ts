
import { PrismaClient } from "../../generated/prisma";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres-log.datasource";
import { logRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { cronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";



const emailService = new EmailService();

export class Server {
    public static start(prisma: PrismaClient) {

        const fsLogRepository = new logRepositoryImpl(
            new FileSystemDataSource()
        )
        const mongoLogRepository = new logRepositoryImpl(
            new MongoLogDatasource()
        )
        const postgresLogRepository = new logRepositoryImpl(
            new PostgresLogDatasource(prisma)
        )

        new SendEmailLogs(
            emailService,
            postgresLogRepository
        ).execute(
            ['programerbyte@gmail.com']
        );

      /*   cronService.createJob( */
         //   '*/3 * * * * *',
      /*       () => {
                console.log("ejecutandose");
               const url = 'https://www.google.com';
               new CheckServiceMultiple(
                [fsLogRepository, mongoLogRepository, postgresLogRepository],
                () => console.log('success callback'),
                (error: Error) => console.log('error callback', error)
               ).execute(url)
               //new CheckService().execute('http://localhost:3000/')
            }
        ); */
    }
}