import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { IngATM as IngATMEntity } from './ing-atm.entity';

@Controller('ingATMs')
export class IngATMsController {
    constructor(private readonly ingATMsService: InMemoryDBService<IngATMEntity>) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async findAll() {
        // get atm list 
        const atmList = await this.ingATMsService.getAll();
        return atmList;
    }


    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(@Body() post: IngATMEntity): Promise<IngATMEntity> {
        // create a new ATM record
        return await this.ingATMsService.create(post);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async update(@Param('id') id: string, @Body() ingATM: IngATMEntity): Promise<IngATMEntity> {
        // get the number of row affected and the updated ATM record
         await this.ingATMsService.update(ingATM);
        // return the updated ATM data
        return this.ingATMsService.get(id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async remove(@Param('id') id: string) {
        // delete the ATM with this id
        await this.ingATMsService.delete(id);
        // return success message
        return 'Successfully deleted';
    }
}
