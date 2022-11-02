import { createClient } from 'redis';

export const client = createClient({
  url: `rediss://default:${process.env.UPSTASH_PASSWORD}@${process.env.UPSTASH_REGION}-solid-husky-38167.upstash.io:38167`,
});

client.on('connect', function () {
  console.log('Connected!');
});
