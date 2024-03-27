import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // Enable WebSocket with the socket.io adapter
  // app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(3000);
  // app.enableShutdownHooks();
}
bootstrap();
