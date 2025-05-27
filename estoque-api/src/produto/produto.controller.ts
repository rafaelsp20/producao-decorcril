// src/produto/produto.controller.ts
import { Controller, Get, Post, Body, Param, HttpStatus, Delete, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { Produto } from './entities/produto.entity';
import { FileInterceptor } from '@nestjs/platform-express';
//import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { Express } from 'express'; // Adicione esta linha
import { CreateProdutoDto } from './dto/create-produto.dto';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  async create(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return this.produtoService.create(createProdutoDto);
  }

  @Get()
  async findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Produto> {
    return this.produtoService.findOne(+id);
  }

  @Post(':id/insumos')
  async addInsumo(
    @Param('id') id: string,
    @Body() dto: { insumoId: number, quantidadeNecessaria: number }
  ) {
    return this.produtoService.addInsumoToProduto(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.produtoService.remove(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProdutoDto: any // ou um DTO específico se tiver
  ) {
    return this.produtoService.update(id, updateProdutoDto);
  }


}