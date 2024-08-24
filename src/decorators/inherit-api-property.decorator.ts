import { ApiProperty } from '@nestjs/swagger';
import 'reflect-metadata';

function getPropertyDecorators(target: any, propertyKey: string) {
  return Reflect.getMetadata('design:decorators', target, propertyKey) || [];
}

export function InheritApiProperty(sourceClass: any) {
  return (target: any, propertyKey: string) => {
    const decorators = getPropertyDecorators(sourceClass.prototype, propertyKey);
    const apiPropertyDecorator = decorators.find((d: any) => d instanceof ApiProperty);
    if (apiPropertyDecorator) {
      ApiProperty(apiPropertyDecorator)(target, propertyKey);
    }
  };
}
