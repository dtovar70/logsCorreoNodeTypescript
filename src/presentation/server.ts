import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource";
import { logRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { cronService } from "./cron/cron-service";

const fileSystemLogRepository = new logRepositoryImpl(
    new FileSystemDataSource()
)

export class Server {
    public static start() {

        console.log('Server started');
        cronService.createJob(
            '*/3 * * * * *',
            () => {
                const url = 'https://www.google.com';
               new CheckService(
                fileSystemLogRepository,
                () => console.log('success callback'),
                (error: Error) => console.log('error callback', error)
               ).execute(url)
              /*  new CheckService().execute('http://localhost:3000/') */
            }
        );
    }
}