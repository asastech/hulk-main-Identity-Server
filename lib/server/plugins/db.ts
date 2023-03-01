import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import Knex, { Knex as KnexType } from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';
import { models } from '../models';

declare module 'fastify' {
	interface FastifyInstance {
		knex: KnexType<any, unknown[]>;
		models: typeof models;
	}
}

async function db(fastify: FastifyInstance) {
	const knex = Knex({
		client: 'pg',
		connection: fastify.config.DATABASE_URL,
		searchPath: ['public', 'hulk'],
		asyncStackTraces: fastify.config.NODE_ENV === 'development',
		pool: {
			min: 2,
			max: 10,
		},
		debug: fastify.config.LOG_LEVEL === 'debug',
		log: {
			warn(message: string) {
				fastify.log.warn(message);
			},
			error(message: string) {
				fastify.log.error(message);
			},
			debug(message: string) {
				fastify.log.debug(message);
			},
			deprecate(method: string, alternative: string) {
				fastify.log.warn(
					`Method ${method} is deprecated. Please use ${alternative}.`,
				);
			},
			enableColors: fastify.config.NODE_ENV === 'development',
		},
		...knexSnakeCaseMappers(),
	});

	// Shutdown db connection when the server closes
	fastify.addHook('onClose', async () => {
		fastify.log.debug('Database shutting down...');
		await knex.destroy();
	});

	Model.knex(knex);
	fastify.decorate('knex', knex);
	fastify.decorate('models', models);
}

export default fp(db, {
	name: 'db',
	dependencies: ['config'],
});
