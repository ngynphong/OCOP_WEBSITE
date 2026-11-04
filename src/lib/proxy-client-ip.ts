import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';

export function signedClientIp(headers: Headers): string | undefined {
  const secret = process.env.OCOP_PROXY_IP_SECRET;
  // Only the trusted ingress may set this header. It must replace any inbound value.
  const ip = headers.get('x-ocop-ingress-ip');
  if (!secret || Buffer.byteLength(secret) < 32 || !ip || !isIP(ip)) return;

  const payload = Math.floor(Date.now() / 1000) + ';' + ip;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return payload + ';' + signature;
}
