// core/config/mailer.config.ts
export function getMailerConfig(configService: ConfigService): MailerOptions {
  return {
    transport: {
      host: configService.getOrThrow<string>('MAIL_HOST'),
      port: configService.getOrThrow<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: configService.getOrThrow<string>('MAIL_LOGIN'),
        pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
      },
    },
    defaults: {
      from: `"Steamify" <${configService.getOrThrow<string>('MAIL_LOGIN')}>`
    }
  }
}