const { Kafka } = require('kafkajs');
const { createLogger } = require('../utils/logger');

const logger = createLogger('Kafka-Service');

class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'notification-service',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });
    this.consumer = null;
  }

  async connect() {
    this.consumer = this.kafka.consumer({ groupId: 'notification-service-group' });
    await this.consumer.connect();
    logger.info('Kafka connected');
  }

  async subscribeToTopic(topic, callback) {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: false });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const data = JSON.parse(message.value.toString());
          await callback(data);
        },
      });
      logger.info(`Subscribed to topic: ${topic}`);
    } catch (error) {
      logger.error(`Failed to subscribe to ${topic}:`, error);
    }
  }
}

module.exports = { KafkaService };
