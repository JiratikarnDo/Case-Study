import { Controller, Get } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';

@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Get()
  findAll() {
    return this.specialtyService.findAll();
  }
}
