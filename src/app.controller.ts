import { Controller, Delete, Get, HttpCode } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Delete('v1/clear-cache')
  @HttpCode(204)
  clearCache() {
    return this.appService.clearCache();
  }
}
