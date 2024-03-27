import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Socket;

  waitingList: string[] = [];

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.server.in(client.id).emit('log_out_other_user', {
      sender: 'Server',
    });
    client.leave(client.id);
  }

  sendMessage(message: string) {
    console.log('clientMessage=======>', message);
    this.server.broadcast
      .to('room_1')
      .emit('clientMessage', { sender: 'Server', message });
  }

  @SubscribeMessage('log_in')
  logIn(client: Socket, payload: { message: string }): void {
    console.log('this.waitingList====>', this.waitingList);

    if (this.waitingList.length > 0) {
      const client_id = this.waitingList[0];
      this.waitingList.splice(0, 1);

      client.join(client_id);
      console.log(
        'You have been connected with other client: ' + client_id,
        this.waitingList,
      );

      this.server.in(client_id).emit('login_server', {
        sender: 'Server',
        message: 'You have been connected with other client: ' + client_id,
        client_id_room: client_id,
      });

      return;
    }

    if (
      this.waitingList.length === 0 ||
      !this.waitingList.includes(client.id)
    ) {
      this.waitingList.push(client.id);
      console.log(
        'No client connected. Your client id: ' + this.waitingList[0],
        this.waitingList,
      );
      client.join(this.waitingList[0]);
      this.server.in(this.waitingList[0]).emit('login_server', {
        sender: 'Server',
        message: 'New client connected: ' + this.waitingList[0],
        client_id_room: this.waitingList[0],
      });
    }
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, payload: { message: string }): void {
    client.join('room_1');
  }

  @SubscribeMessage('clientMessage')
  handleMessage(client: Socket, payload): void {
    this.server.in(payload.client_id_room).emit('message_server', {
      sender: 'Server',
      message: payload.message,
      user: payload.user,
    });
  }

  @SubscribeMessage('log_out')
  logOut(client: Socket, payload): void {
    console.log('payload.client_id_room===>', payload.client_id_room);
    client.in(payload.client_id_room).emit('log_out_other_user', {
      sender: 'Server',
    });
    client.leave(payload.client_id_room);
  }
}
