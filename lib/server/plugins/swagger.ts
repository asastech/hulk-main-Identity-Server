import fastifySwagger from '@fastify/swagger';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function swagger(fastify: FastifyInstance, _: unknown) {
	await fastify.register(fastifySwagger, {
		swagger: {
			info: {
				title: 'Hulk API Documentation',
				description: 'Swagger Spec for Hulk',
				version: '1.0',
			},
			schemes: ['http'],
			consumes: ['application/json'],
			produces: ['application/json'],
			tags: [
				{ name: 'Applications' },
				{ name: 'Authentication' },
				{ name: 'General' },
			],
		},
		routePrefix: '/docs',
		mode: 'dynamic',
		exposeRoute:
			fastify.config.NODE_ENV !== 'production' &&
			fastify.config.APP_ENV !== 'production',
	});
}

export default fp(swagger, {
	name: 'swagger',
	dependencies: ['config'],
});
