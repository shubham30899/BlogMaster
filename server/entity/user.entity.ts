import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('users')
export class User {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('int') // ← EXPLICIT TYPE
  id: number;

  @Column('string')
  username: string;

  @Column('string')
  password: string;

  @Column('date')
  createdAt: Date = new Date();

  @Column('date')
  updatedAt: Date = new Date();
}
