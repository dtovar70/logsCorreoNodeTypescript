
import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin';
import { LogRepository } from '../../domain/respositoty/log.repository';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

interface SendEmailOptions{
    to: string | string [];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[];
}

interface Attachment {
    filename: string;
    path: string;
}

export class EmailService {

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY,
        },
    });

    constructor(){}

    async sendEmail(options: SendEmailOptions): Promise<boolean> { 

        const { to, subject, htmlBody, attachments = [] } = options;

        try{

            const sendInformation = await this.transporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments
            });

            const log = new LogEntity({
                level: LogSeverityLevel.low,
                message: 'Email sent',
                origin: 'email.service.ts',
            });

            return true;
        }catch(error){ 

                const log = new LogEntity({
                level: LogSeverityLevel.high,
                message: 'Email was not sent',
                origin: 'email.service.ts',
            });

            return false;
        }

    }

    sendEmailWithFileSystemLogs(to: string | string[]){
        const subject = 'Report with Attachment';
        const htmlBody = '<h1>Please find the attached report.</h1>';
        const attachments: Attachment[] = [
            {filename: ' logs-low.log', path: './logs/logs-low.log'},
            {filename: ' logs-high.log', path: './logs/logs-high.log'},
            {filename: ' logs-medium.log', path: './logs/logs-medium.log'},
        ];

        this.sendEmail({ to, subject, htmlBody, attachments });

        return true;
    }
 }

