import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class UserLoginDto {
    @IsNotEmpty()
    @ApiProperty()
    readonly username: string;

    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty()
    readonly password: string;
}
