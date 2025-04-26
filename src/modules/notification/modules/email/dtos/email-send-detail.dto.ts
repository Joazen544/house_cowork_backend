export class EmailSendDetails {
  from: string;
  to: string;
  subject: string;
  htmlBody: string;
  textBody: string;

  constructor(from: string, to: string, subject: string, htmlBody: string, textBody: string) {
    this.from = from;
    this.to = to;
    this.subject = subject;
    this.htmlBody = htmlBody;
    this.textBody = textBody;
  }
}
