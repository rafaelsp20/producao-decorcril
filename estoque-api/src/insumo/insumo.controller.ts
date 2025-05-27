/* eslint-disable prettier/prettier */
// src/insumo/insumo.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InsumoService } from './insumo.service';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { Insumo } from './entities/insumo.entity';
import { Express } from 'express';
import { VinculoXmlDto } from './dto/vinculo-xml.dto';

@Controller('insumos')
export class InsumoController {
  constructor(private readonly insumoService: InsumoService) {}

  @Post()
  async create(@Body() createInsumoDto: CreateInsumoDto): Promise<Insumo> {
    return this.insumoService.create(createInsumoDto);
  }

  @Get()
  async findAll(): Promise<Insumo[]> {
    return this.insumoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Insumo> {
    return this.insumoService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateInsumoDto: UpdateInsumoDto): Promise<Insumo> {
    return this.insumoService.update(+id, updateInsumoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.insumoService.remove(+id);
  }

  @Post('importar-xml')
  @UseInterceptors(FileInterceptor('xml', { dest: './uploads/xmls' }))
  async importarXml(@UploadedFile() xml: Express.Multer.File) {
    return this.insumoService.importarXml(xml.path);
  }
  
}