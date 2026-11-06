import { ReconnectionTimeMode } from '@stomp/stompjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axiosClient } from '../axios';
import { createStompClient } from '../websocket';

describe('WebSocket ticket requests', () => {
  afterEach(() => vi.restoreAllMocks());

  it('requests a fresh ticket silently and backs off repeated reconnects', async () => {
    const post = vi.spyOn(axiosClient, 'post').mockResolvedValue({ data: 'one-use ticket' });
    const client = createStompClient();

    await client.beforeConnect(client);
    await client.beforeConnect(client);

    expect(post).toHaveBeenCalledTimes(2);
    expect(post).toHaveBeenCalledWith('/ws-tickets', null, {
      headers: { 'X-Silent-Loading': 'true' },
    });
    expect(client.brokerURL).toContain('ticket=one-use%20ticket');
    expect(client.reconnectDelay).toBe(5000);
    expect(client.reconnectTimeMode).toBe(ReconnectionTimeMode.EXPONENTIAL);
    expect(client.maxReconnectDelay).toBe(60000);
  });

  it('deactivates when a ticket cannot be obtained', async () => {
    vi.spyOn(axiosClient, 'post').mockRejectedValue(new Error('ticket unavailable'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const client = createStompClient();
    const deactivate = vi.spyOn(client, 'deactivate').mockResolvedValue();

    await client.beforeConnect(client);

    expect(deactivate).toHaveBeenCalledOnce();
  });
});
