const os = require("os");
const winston = require('winston');

const config = require('./config');

class Logger {
    constructor() {
        this.hostname = os.hostname();

        this.logger = winston.createLogger({
            level: config.winston.level || 'info',
            format: winston.format.json(),
            defaultMeta: {service: config.winston.service},
            transports: [
                new winston.transports.File({filename: config.winston.error_log || 'error.log', level: 'error'}),
                new winston.transports.File({filename: config.winston.combined_log || 'combined.log'}),
            ],
        });
        if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV !== 'staging') {
            this.logger.add(
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.metadata({fillExcept: ['timestamp', 'service', 'level', 'message']}),
                        winston.format.colorize(),
                        this.winstonConsoleFormat()
                    )
                })
            );
        }
    }

    winstonConsoleFormat() {
        return winston.format.printf(({timestamp, service, level, message}) => {
            return `[${timestamp}][${level}][${service}@${this.hostname}] ${message}`;
        })
    }

    debug(log, metadata) {
        this.logger.debug(log, metadata);
    }

    info(log, metadata) {
        this.logger.info(log, metadata);
    }

    warn(log, metadata) {
        this.logger.warn(log, metadata);
    }

    error(log, metadata) {
        this.logger.error(log, metadata);
    }

    log(level, log, metadata) {
        const metadataObject = {}
        if (metadata) metadataObject.metadata = metadata

        this.logger[level](log, metadataObject)
    }
}

module.exports = new Logger('winston');

module.getLogger = () => {
    return new Logger();
}