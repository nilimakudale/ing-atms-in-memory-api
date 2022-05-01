import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty()
    readonly name: string;
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    readonly email: string;
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty()
    readonly password: string;
}


export class UpdateUserDto {
    @ApiProperty({ type: String, required: false })
    readonly name: string;
    @ApiProperty({ type: String, required: false })
    @IsEmail()
    readonly email: string;
    @ApiProperty({ type: String, required: false })
    @MinLength(6)
    readonly password: string;
}





