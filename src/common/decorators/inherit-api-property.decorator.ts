import { ApiProperty } from '@nestjs/swagger';

export function InheritApiProperty(sourceClass: any) {
  return (target: any, key: string) => {
    const metadata = Reflect.getMetadata('swagger/apiModelProperties', sourceClass.prototype, key);
    if (metadata) {
      ApiProperty(metadata)(target, key);
    }
  };
}
