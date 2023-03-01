import { FastifyInstance } from 'fastify';
import { schema } from './spec.json';

interface IHeaders {
	authorization: string;
}

export default async function registerListApplicationsRoute(
	fastify: FastifyInstance,
) {
	fastify.route<{ Headers: IHeaders }>({
		method: 'GET',
		url: '/',
		schema,
		handler: async (request, reply) => {
			const { Application } = fastify.models;
			const accountId = request.requestContext.get('accountId') as string;

			const applications = await Application.query()
				.where({ accountId })
				.orderBy('createdAt', 'ASC');

			return reply.status(200).send({
				success: true,
				message: 'Applications listed.',
				data: { applications },
			});
		},
	});
}
