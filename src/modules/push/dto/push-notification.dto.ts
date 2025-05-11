import { PushTemplateKey } from '../enum/push-template-key.enum';
import { TemplateParamsMap } from '../types/template-params-map.type';

export class PushNotificationDto {
  targetUserId!: number;
  pushTemplateKey!: PushTemplateKey;
  variables!: TemplateParamsMap[keyof TemplateParamsMap];
}
