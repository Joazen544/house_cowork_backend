import { PushTemplateKey } from '../enum/push-template-key.enum';
import { NewTaskPushParams } from './push-params.type';

export type TemplateParamsMap = {
  [PushTemplateKey.NEW_TASK]: NewTaskPushParams;
};
