import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GeoLocation } from '../ing-atm.entity';

export class IngATMDto {
    @ApiProperty({ type: String, required: true })
    @IsNotEmpty()
    @MinLength(4)
    name: string;
    @ApiProperty({ type: String, required: false })
    country: string;
    @ApiProperty({ type: String, required: false })
    zipCode: string;
    @ApiProperty({ type: String, required: false })
    state: string;
    @ApiProperty({ type: String, required: false })
    street: string;
    @ApiProperty({ type: String, required: false })
    city: string;
    @ApiProperty({required:false})
    geoLocation: GeoLocation;
}


