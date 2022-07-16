import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { ResponseError } from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';

@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService) { }

    async sendEmail(email: string, subject: string, message: string, content: string): Promise<boolean> {
        sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
        const msg: MailDataRequired = {
            to: email,
            from: this.configService.get('SENDER_IDENTITY'),
            subject: subject,
            text: message,
            html: content,
        };

        try {
            await sgMail.send(msg);
            return true
        } catch (err) {
            console.error(err.message);
            if (err instanceof ResponseError && err.response) {
                throw new HttpException(err.response.body, err.code);
            }
        }
    }
}