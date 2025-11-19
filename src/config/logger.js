import winston from 'winston';
import axios from 'axios';

const betterStackToken = process.env.BETTERSTACK_TOKEN;

const logtailTransport = {
  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (betterStackToken) {
      const logData = {
        dt: new Date().toISOString(),
        level: info.level,
        message: info.message,
        ...info,
      };

      axios
        .post('https://in.logs.betterstack.com', logData, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${betterStackToken}`,
          },
        })
        .catch((error) => {
          console.error('Logtail logging failed:', error.message);
        });
    }

    callback();
  },
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

if (betterStackToken) {
  logger.add(logtailTransport);
}

export default logger;
