import { Server as SocketServer } from 'socket.io'
import { Server as NodeServer } from 'node:http'
import { GetMessagesEvent } from './types/socket.types'
import { ORIGIN, CREDENTIALS } from './config/env'

export class SocketProvider {
  private io: SocketServer

  constructor(server: NodeServer) {
    this.io = new SocketServer(server, {
      serveClient: false,
      cors: {
        origin: ORIGIN,
        credentials: CREDENTIALS
      }
    })

    this.io.on('connection', (socket) => {
      socket.on('get-messages', ({ id, page }: GetMessagesEvent) => {
        console.log('Get messages event', id, page)
      })

      socket.on('disconnect', () => {
        console.log('Adios mundo')
      })
    })
  }

  /**
   * Allows sending a message through the socket connection
   * @param eventType
   * @param data
   */
  public sendMessage(eventType: string, data: unknown) {
    this.io.emit(eventType, data)
  }
}
