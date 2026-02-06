import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
/* import { PrismaClient, SeverityLevel } from "@prisma/client"; */
import { PrismaClient, SeverityLevel } from "../../../generated/prisma";

const severityEmun = {
    low: SeverityLevel.LOW,
    medium: SeverityLevel.MEDIUM,
    high: SeverityLevel.HIGH,
}


export class PostgresLogDatasource implements LogDataSource {
     constructor(private readonly prisma: PrismaClient) {}

    async saveLog( log: LogEntity ): Promise<void> {

        const level = severityEmun[log.level];
        
        const newLog = await this.prisma.log_model.create({
            data: {
                ...log,
                level
            }
        });

        console.log("postgres saved");

    }

    async getLogs(SeverityLevel: LogSeverityLevel): Promise<LogEntity[]> {
      
        const level = severityEmun[SeverityLevel];

        const dbLogs = await this.prisma.log_model.findMany({
            where: {
                level
            }
        });

        return dbLogs.map( dbLog => LogEntity.fromObject(dbLog));
    }

}