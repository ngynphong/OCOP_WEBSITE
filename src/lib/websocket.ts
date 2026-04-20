import { Client } from '@stomp/stompjs';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchWsTicket(accessToken: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/ws-tickets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Failed to get WS ticket');
  const body = await res.json();
  return body.data;
}

export function createStompClient(accessToken: string): Client {
  const client = new Client({
    brokerURL: WS_BASE_URL,
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: (str) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[STOMP]: ' + str);
      }
    },
  });

  client.beforeConnect = async () => {
    try {
      const ticket = await fetchWsTicket(accessToken);
      client.brokerURL = `${WS_BASE_URL}?ticket=${ticket}`;
      client.connectHeaders = {
        Authorization: `Bearer ${accessToken}`,
      };
    } catch (err) {
      console.error('[STOMP] Failed to fetch WS ticket, aborting connection:', err);
      await client.deactivate();
    }
  };

  return client;
}
