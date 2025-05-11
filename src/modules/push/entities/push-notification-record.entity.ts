import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Device } from '../../devices/entities/device.entity';
import { PushTemplate } from './push-template.entity';

export enum PushNotificationRecordStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed',
}

@Entity('push_notification_records')
export class PushNotificationRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  message!: string;

  @Column('json', { nullable: true })
  variables!: Record<string, any>;

  @ManyToOne(() => PushTemplate)
  template!: PushTemplate;

  @Column({ default: PushNotificationRecordStatus.PENDING })
  sendStatus!: PushNotificationRecordStatus;

  @ManyToOne(() => Device)
  device!: Device;

  @Column({ nullable: true })
  targetPage!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
