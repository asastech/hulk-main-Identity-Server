import pino, { Level, multistream, StreamEntry } from 'pino';
import pretty from 'pino-pretty';

const {
	LOG_LEVEL = 'debug',
	DISABLE_LOGGING = false,
	NODE_ENV = 'development',
	SERVICE_NAME = 'iam',
} = process.env;

const streams: StreamEntry[] = [];

if (NODE_ENV === 'development') {
	streams.push({
		stream: pretty({ colorize: true, sync: true }),
		level: LOG_LEVEL as Level,
	});
} else {
	streams.push({ stream: process.stdout, level: LOG_LEVEL as Level });
}

const logger = pino(
	{
		name: SERVICE_NAME,
		level: LOG_LEVEL,
		enabled: !DISABLE_LOGGING,
		timestamp: true,
	},
	multistream(streams),
);

export default logger;
