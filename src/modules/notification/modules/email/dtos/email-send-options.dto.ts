export class EmailSendOptions {
  to: string;
  from: string;
  subject: string;
  htmlBody: string;
  textBody: string;

  constructor(to: string, from: string, subject: string, htmlBody: string, textBody: string) {
    this.to = to;
    this.from = from;
    this.subject = subject;
    this.htmlBody = htmlBody;
    this.textBody = textBody;
  }
}
