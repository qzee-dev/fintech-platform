const { Kafka } = require('kafkajs');
const { createLogger } = require('../utils/logger');

const logger = createLogger('Kafka-Service');

class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });
    this.producer = null;
    this.consumer = null;
  }

  async connect() {
    this.producer = this.kafka.producer();
    await this.producer.connect();

    this.consumer = this.kafka.consumer({ groupId: 'transaction-service-group' });
    await this.consumer.connect();

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
