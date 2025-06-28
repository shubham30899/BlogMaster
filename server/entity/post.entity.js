var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';
let Post = class Post {
};
__decorate([
    ObjectIdColumn(),
    __metadata("design:type", ObjectId)
], Post.prototype, "_id", void 0);
__decorate([
    Column('int'),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    Column('string'),
    __metadata("design:type", String)
], Post.prototype, "title", void 0);
__decorate([
    Column('string', { unique: true }),
    __metadata("design:type", String)
], Post.prototype, "slug", void 0);
__decorate([
    Column('string'),
    __metadata("design:type", String)
], Post.prototype, "author", void 0);
__decorate([
    Column('string'),
    __metadata("design:type", String)
], Post.prototype, "content", void 0);
__decorate([
    Column('string', { nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "coverImage", void 0);
__decorate([
    Column('string', { nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "category", void 0);
__decorate([
    Column('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Post.prototype, "tags", void 0);
__decorate([
    Column('date'),
    __metadata("design:type", Date)
], Post.prototype, "publishedDate", void 0);
__decorate([
    Column('date'),
    __metadata("design:type", Date)
], Post.prototype, "updatedDate", void 0);
Post = __decorate([
    Entity('posts')
], Post);
export { Post };
