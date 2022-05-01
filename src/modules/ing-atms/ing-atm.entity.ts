import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export type GeoLocation = {
    lat: string;
    lng: string
}

export interface IngATM extends InMemoryDBEntity {
    name: string;
    country?: string;
    zipCode?: string;
    state?: string;
    street?: string;
    city?: string;
    geoLocation?: GeoLocation;
}
