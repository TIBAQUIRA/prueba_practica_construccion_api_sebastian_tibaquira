import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from './shared/interceptors/business-errors.interceptor';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(BusinessErrorsInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
