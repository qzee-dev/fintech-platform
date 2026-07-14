const { Kafka } = require('kafkajs');
const { createLogger } = require('../utils/logger');

const logger = createLogger('Kafka-Service');

class KafkaService {
  constructor(serviceName, groupId = null) {
    this.serviceName = serviceName;
    this.groupId = groupId;
    this.kafka = new Kafka({
      clientId: serviceName,
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });
    this.producer = null;
    this.consumer = null;
  }

  async connect() {
    try {
      this.producer = this.kafka.producer();
      await this.producer.connect();
      if (this.groupId) {
        this.consumer = this.kafka.consumer({ groupId: this.groupId });
        await this.consumer.connect();
      }
      logger.info(`Kafka connected for ${this.serviceName}`);
    } catch (error) {
      logger.error(`Failed to connect to Kafka: ${error.message}`);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.producer) await this.producer.disconnect();
      if (this.consumer) await this.consumer.disconnect();
      logger.info(`Kafka disconnected for ${this.serviceName}`);
    } catch (error) {
      logger.error(`Failed to disconnect from Kafka: ${error.message}`);
    }
  }

  async publishEvent(topic, message) {
    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      logger.info(`Event published to ${topic}`);
    } catch (error) {
      logger.error(`Failed to publish event to ${topic}: ${error.message}`);
      throw error;
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
      logger.error(`Failed to subscribe to ${topic}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = { KafkaService };
