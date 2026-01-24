import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import  fs  from 'fs';



export class FileSystemDataSource implements LogDataSource{

    private readonly logPath = 'logs/';
    private readonly lowLogsPath = 'logs/logs-low.log'
    private readonly mediumLogsPath = 'logs/logs-medium.log'
    private readonly highLogsPath = 'logs/logs-high.log'

    constructor(){
        this.createLogsFiles();
    }

    private createLogsFiles = () => {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath);
        }

        const logFiles = [this.lowLogsPath, this.mediumLogsPath, this.highLogsPath];

        // Si todos los archivos existen, retorna
        if (logFiles.every(path => fs.existsSync(path))) return;

        // Si alguno no existe, créalo
        logFiles.forEach(path => {
            if (!fs.existsSync(path)) {
                fs.writeFileSync(path, '');
            }
        });
    }

    async saveLog(newLog: LogEntity): Promise<void> {

        const logAsJson = `${JSON.stringify(newLog)}\n`;
        
        fs.appendFileSync( this.lowLogsPath, logAsJson );

        if( newLog.level === LogSeverityLevel.low ) return;

        if( newLog.level === LogSeverityLevel.medium ){
            fs.appendFileSync( this.mediumLogsPath, logAsJson );
        }else{
            fs.appendFileSync( this.highLogsPath, logAsJson );
        }
    }
    private getLogsFromFile( path: string ): LogEntity[] {

        const content = fs.readFileSync( path, 'utf-8' );
        const logs = content.split('\n').map( log => LogEntity.fromJson( log ) );
        return logs;
    }

    getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        
        switch( severityLevel ){
            case LogSeverityLevel.low:
                return Promise.resolve(this.getLogsFromFile( this.lowLogsPath ));
            case LogSeverityLevel.medium:
                return Promise.resolve(this.getLogsFromFile( this.mediumLogsPath ));
            case LogSeverityLevel.high:
                return Promise.resolve(this.getLogsFromFile( this.highLogsPath ));
            default:
                throw new Error(`${severityLevel} not implemented`);
        }
    }


}