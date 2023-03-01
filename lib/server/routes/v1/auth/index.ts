import { FastifyInstance } from 'fastify';
import registerSignUpRoute from './signUp';

export default async function registerAuthRoutes(fastify: FastifyInstance) {
	await fastify.register(registerSignUpRoute, {
		prefix: 'signUp',
	});
}
