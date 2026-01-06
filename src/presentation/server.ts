import { CheckService } from "../domain/use-cases/checks/check-service";
import { cronService } from "./cron/cron-service";


export class Server {
    public static start() {

        console.log('Server started');
        cronService.createJob(
            '*/3 * * * * *',
            () => {
                const url = 'https://www.google.com';
               new CheckService(
                () => console.log('success callback'),
                (error: Error) => console.log('error callback', error)
               ).execute(url)
              /*  new CheckService().execute('http://localhost:3000/') */
            }
        );
    }
}