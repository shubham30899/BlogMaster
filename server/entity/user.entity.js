var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
let User = class User {
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    ObjectIdColumn(),
    __metadata("design:type", ObjectId)
], User.prototype, "_id", void 0);
__decorate([
    Column('int') // ← EXPLICIT TYPE
    ,
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Column('string'),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Column('string'),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Column('date'),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    Column('date'),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    Entity('users')
], User);
export { User };
