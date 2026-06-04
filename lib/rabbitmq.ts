import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

let connection: any = null;
let channel: any = null;

async function getChannel() {
  if (channel) return channel;
  
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

export async function publishToQueue(queueName: string, data: any) {
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
    return false;
  }
}
