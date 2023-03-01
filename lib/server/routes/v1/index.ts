import { FastifyInstance } from 'fastify';
import authRoutes from './auth';
import registerApplicationsRoutes from './applications';

export default async function RegisterV1Routes(
	fastify: FastifyInstance,
	_: unknown,
) {
	await fastify.register(authRoutes, { prefix: 'auth' });
	await fastify.register(registerApplicationsRoutes, {
		prefix: 'applications',
	});
}
