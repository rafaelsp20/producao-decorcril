// src/insumo/dto/update-insumo.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateInsumoDto } from './create-insumo.dto';

export class UpdateInsumoDto extends PartialType(CreateInsumoDto) {}