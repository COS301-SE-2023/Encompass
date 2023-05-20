import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('home')
export class HomeController{
  constructor() {}

  @Get(':id')
  async getHome(@Param('id') id: string) {}
}