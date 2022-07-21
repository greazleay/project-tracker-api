import { Controller, Delete, Get, HttpCode } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller({
  version: '1'
})
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Delete('clear-cache')
  @HttpCode(204)
  clearCache() {
    return this.appService.clearCache();
  }
}
