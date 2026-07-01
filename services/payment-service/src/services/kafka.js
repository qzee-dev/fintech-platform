const { Kafka } = require('kafkajs');
const { createLogger } = require('../utils/logger');

const logger = createLogger('Kafka-Service');

class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'payment-service',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });
    this.producer = null;
  }

  async connect() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
    logger.info('Kafka connected');
  }

  async publishEvent(topic, message) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      logger.info(`Event published to ${topic}`);
    } catch (error) {
      logger.error(`Failed to publish event to ${topic}:`, error);
    }
  }
}

module.exports = { KafkaService };
