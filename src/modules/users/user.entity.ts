import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface User extends InMemoryDBEntity {
    name: string;
    email: string;
    password: string;
}
