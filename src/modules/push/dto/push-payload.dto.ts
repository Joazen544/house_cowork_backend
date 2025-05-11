export class PushPayloadDto {
  data: {
    title: string;
    body: string;
    targetPage: string;
  };

  constructor(title: string, body: string, targetPage: string) {
    this.data = {
      title,
      body,
      targetPage,
    };
  }
}
