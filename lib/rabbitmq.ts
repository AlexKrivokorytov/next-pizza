import amqp, { ChannelModel, Channel } from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

async function getChannel(): Promise<Channel> {
  if (channel) return channel;
  
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    connection = conn;
    const ch = await conn.createChannel();
    channel = ch;

    conn.on('error', (err: unknown) => {
      console.error('[RabbitMQ] Connection error:', err);
      connection = null;
      channel = null;
    });

    conn.on('close', () => {
      console.warn('[RabbitMQ] Connection closed.');
      connection = null;
      channel = null;
    });

    return ch;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

export async function publishToQueue(queueName: string, data: unknown): Promise<boolean> {
  try {
    const ch = await getChannel();
    await ch.assertQueue(queueName, { durable: true });
    
    const message = JSON.stringify(data);
    ch.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
    
    console.log(`[RabbitMQ] Published message to ${queueName}`);
    return true;
  } catch (error) {
    console.error(`[RabbitMQ] Failed to publish message to ${queueName}:`, error);
    throw new Error(`RabbitMQ Publish Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
