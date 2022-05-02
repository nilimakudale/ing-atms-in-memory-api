import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Logger, LoggerService, Inject, InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { IngATM as IngATMEntity } from './ing-atm.entity';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('ING ATMs CRUD')

@Controller('ingATMs')
export class IngATMsController {
    constructor(
        @Inject(Logger) private readonly logger: LoggerService,
        private readonly ingATMsService: InMemoryDBService<IngATMEntity>) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ description: 'Fetched records successfully' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized Access' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error ' })
    async findAllATMs() {
        this.logger.log(`In findAllATMs()...`);
        try {
            // get atm list 
            const atmList = await this.ingATMsService.getAll();
            return atmList;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error.message ? error.message : 'Internal server error')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiBearerAuth('access-token')
    @ApiCreatedResponse({ description: 'New ATM record added' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized Access' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async createATM(@Body() post: IngATMEntity): Promise<IngATMEntity> {
        this.logger.log(`In createATM()...`);
        try {
            // create a new ATM record
            return this.ingATMsService.create(post);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error.message ? error.message : 'Internal server error')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ description: 'Updated record successfully' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized Access' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async updateATM(@Param('id') id: string, @Body() ingATM: IngATMEntity): Promise<IngATMEntity> {
        this.logger.log(`In updateATM()...id=${id}`);
        try {
            // get the number of row affected and the updated ATM record
            this.ingATMsService.update(ingATM);
            // return the updated ATM data
            return this.ingATMsService.get(id)
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error.message ? error.message : 'Internal server error')
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    @ApiBearerAuth('access-token')
    @ApiOkResponse({ description: 'Deleted record successfully' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized Access' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
    async removeATM(@Param('id') id: string) {
        this.logger.log(`In removeATM()...id=${id}`);
        try {
            // delete the ATM with this id
            this.ingATMsService.delete(id);
            // return success message
            return 'Successfully deleted';
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(error.message ? error.message : 'Internal server error')
        }
    }
}
