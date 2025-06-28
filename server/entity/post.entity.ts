import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('posts')
export class Post {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column('int')
  id: number;

  @Column('string')
  title: string;

  @Column('string', { unique: true })
  slug: string;

  @Column('string')
  author: string;

  @Column('string')
  content: string;

  @Column('string', { nullable: true })
  coverImage?: string;

  @Column('string', { nullable: true })
  category?: string;

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @Column('date')
  publishedDate: Date;

  @Column('date')
  updatedDate: Date;
}
