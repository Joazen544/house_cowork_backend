export class PushPayloadDto {
  title: string;
  body: string;
  data?: { [key: string]: string };

  constructor(title: string, body: string, data?: { [key: string]: string }) {
    this.title = title;
    this.body = body;
    this.data = data;
  }
}
