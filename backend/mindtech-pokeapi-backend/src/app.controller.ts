import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { createWriteStream } from 'fs';
import {HttpService} from "@nestjs/axios";
import axios, {AxiosResponse} from "axios";
@Controller('pokemons')

export class AppController {
  constructor(private readonly httpService: HttpService, private readonly appService: AppService) {}

  // @ts-ignore
  @Get()
  async getPokemonTypes() {
    const uri = 'https://pokeapi.co/api/v2/type';
    try {
      const response = await axios.get(uri);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}


