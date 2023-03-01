import { FastifyInstance } from 'fastify';
import registerCreateApplicationRoute from './create';
import registerFetchApplicationRoute from './fetch';
import registerListApplicationsRoute from './listByAccountId';
import registerDeleteApplicationRoute from './delete';

export default async function registerApplicationsRoutes(
	fastify: FastifyInstance,
) {
	fastify.addHook('preHandler', fastify.auth.checkForAccessToken);
	fastify.addHook(
		'preHandler',
		fastify.auth.checkForPermissions(['hulk-user']),
	);
	fastify.addHook('preHandler', fastify.auth.checkAccountStatus);

	await fastify.register(registerCreateApplicationRoute);
	await fastify.register(registerFetchApplicationRoute);
	await fastify.register(registerListApplicationsRoute);
	await fastify.register(registerDeleteApplicationRoute);
}
