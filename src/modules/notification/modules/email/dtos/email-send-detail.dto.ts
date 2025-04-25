export class EmailSendDetails {
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;

  constructor(to: string, subject: string, htmlBody: string, textBody: string) {
    this.to = to;
    this.subject = subject;
    this.htmlBody = htmlBody;
    this.textBody = textBody;
  }
}
