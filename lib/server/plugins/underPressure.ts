import fp from 'fastify-plugin';
import underPressurefp from '@fastify/under-pressure';
import { FastifyInstance } from 'fastify';

async function underPressure(fastify: FastifyInstance) {
	await fastify.register(underPressurefp, {
		exposeStatusRoute: {
			routeOpts: {
				logLevel: fastify.config.LOG_LEVEL,
			},
			routeSchemaOpts: {
				tags: ['General'],
				description:
					"Ensures the service is healthy by invoking the DB, Cache and the Keycloak server if they're alive and running.",
				summary: 'Runs a Healthcheck.',
			},
			routeResponseSchemaOpts: {
				status: { type: 'string', default: 'ok' },
				metrics: {
					type: 'object',
					properties: {
						eventLoopDelay: { type: 'number' },
						rssBytes: { type: 'number' },
						heapUsed: { type: 'number' },
						eventLoopUtilized: { type: 'number' },
					},
				},
			},
			url: '/health',
		},
		healthCheck: async server => {
			try {
				const dbIsAlive =
					(await server.knex.raw('select 1+1 as result')).rows[0].result === 2;

				await fastify.cache.set('connection_test', 'true', 'EX', 3);
				const cacheIsAlive =
					(await fastify.cache.get('connection_test')) === 'true';

				const response = await server.keycloak.healthCheckClient.request({
					method: 'GET',
					url: '/',
				});

				const keycloakIsAlive = response.status === 200;

				if (!keycloakIsAlive) {
					server.log.error({ keycloakIsAlive, response }, 'Keycloak is down.');
					return false;
				}

				if (!dbIsAlive) {
					server.log.error('Database is unreachable.');
					return false;
				}

				if (!cacheIsAlive) {
					server.log.error('Cache is unreachable');
					return false;
				}

				return {
					status: 'ok',
					metrics: server.memoryUsage(),
				};
			} catch (error) {
				server.log.error(
					error,
					'An error occured while attempting to run a health check.',
				);
				return false;
			}
		},
		healthCheckInterval: 5000, // Every 5 seconds
	});
}

export default fp(underPressure, {
	name: 'underPressure',
	dependencies: ['config', 'db', 'keycloak', 'cache'],
});
