import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly name: string;
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    readonly password: string;
}


export class UpdateUserDto {
    @ApiProperty({required:false})
    readonly name: string;

    @ApiProperty({required:false})
    @IsEmail()
    readonly email: string;
    
    @ApiProperty({required:false})
    @MinLength(6)
    readonly password: string;
}





