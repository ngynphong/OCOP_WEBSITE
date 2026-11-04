import { Client } from '@stomp/stompjs';
import { axiosClient } from './axios';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL;
export function createStompClient(): Client {
  const client = new Client({
    brokerURL: WS_BASE_URL,
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  });

  client.beforeConnect = async () => {
    try {
      const { data: ticket }: { data: string } = await axiosClient.post('/ws-tickets');
      client.brokerURL = `${WS_BASE_URL}?ticket=${encodeURIComponent(ticket)}`;
    } catch (err) {
      console.error('[STOMP] Failed to fetch WS ticket, aborting connection:', err);
      await client.deactivate();
    }
  };

  return client;
}
