import { FastifyInstance } from 'fastify';
import { schema } from './spec.json';

interface IHeaders {
	authorization: string;
}

interface IParams {
	name: string;
}

export default async function registerFetchApplicationRoute(
	fastify: FastifyInstance,
) {
	fastify.route<{ Params: IParams; Headers: IHeaders }>({
		method: 'GET',
		url: '/:name',
		schema,
		handler: async (request, reply) => {
			const { Application } = fastify.models;
			const { name } = request.params;
			const accountId = request.requestContext.get('accountId') as string;

			const application = await Application.query()
				.findOne({
					accountId,
					name,
				})
				.withGraphFetched('client');
			if (!application) {
				return reply.notFound('Application not found.');
			}

			switch (application.status) {
				case 'DELETED':
				case 'INACTIVE': {
					return reply.badRequest(
						'Your application is banned or disabled. Please contact the administration.',
					);
				}
				case 'ACTIVE': {
					break;
				}
			}

			return reply.status(200).send({
				success: true,
				message: 'Application fetched.',
				data: { application },
			});
		},
	});
}
