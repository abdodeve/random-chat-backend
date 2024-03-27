import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatController } from './chat/chat.controller';
import { WebsocketGateway } from './websocket/websocket.gateway';

@Module({
  imports: [],
  controllers: [AppController, ChatController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule {}
