import { Controller, Get, Inject, Post, Body } from '@nestjs/common';
import { WebsocketGateway } from './websocket/websocket.gateway';

@Controller()
export class AppController {
  constructor(private appGateway: WebsocketGateway) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('send')
  sendToClients(@Body() body: { client_id: string; message: string }) {
    this.appGateway.server.in(body.client_id).emit('message_server', {
      sender: 'Server',
      message: body.message,
    });
    return 'Message sent to clients';
  }
}
