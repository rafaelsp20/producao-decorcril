// src/ordem-producao/ordem-producao.controller.ts
import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { OrdemProducaoService } from './ordem-producao.service';
import { CreateOrdemProducaoDto } from './dto/create-ordem-producao.dto';
import { OrdemProducao } from './entities/ordem-producao.entity';
import { OrdemProducaoStatus } from '../common/enums/ordem-producao-status.enum';

@Controller('ordens-producao')
export class OrdemProducaoController {
  constructor(private readonly ordemProducaoService: OrdemProducaoService) {}

  @Post()
  async create(@Body() createOrdemProducaoDto: CreateOrdemProducaoDto): Promise<OrdemProducao> {
    return this.ordemProducaoService.create(createOrdemProducaoDto);
  }

  @Get()
  async findAll(): Promise<OrdemProducao[]> {
    return this.ordemProducaoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OrdemProducao> {
    return this.ordemProducaoService.findOne(+id);
  }

  @Patch(':id/iniciar')
  async iniciarProducao(@Param('id') id: string): Promise<OrdemProducao> {
    return this.ordemProducaoService.iniciarProducao(+id);
  }

  @Patch(':id/finalizar')
  async finalizarProducao(@Param('id') id: string): Promise<OrdemProducao> {
    return this.ordemProducaoService.finalizarProducao(+id);
  }

  @Patch(':id/cancelar')
  async cancelarProducao(@Param('id') id: string): Promise<OrdemProducao> {
    return this.ordemProducaoService.cancelarProducao(+id);
  }
}