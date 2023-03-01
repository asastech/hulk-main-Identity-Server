import { FastifyInstance } from 'fastify';
import { schema } from './spec.json';

interface IHeaders {
	authorization: string;
}

interface IParams {
	applicationId: string;
}

export default async function registerDeleteApplicationRoute(
	fastify: FastifyInstance,
) {
	fastify.route<{ Params: IParams; Headers: IHeaders }>({
		method: 'DELETE',
		url: '/:applicationId',
		schema,
		handler: async (request, reply) => {
			const { Application, Client } = fastify.models;
			const accountId = request.requestContext.get('accountId') as string;
			const { applicationId } = request.params;

			const application = await Application.query().findOne({
				id: applicationId,
				accountId,
			});
			if (!application) {
				return reply.notFound('Application not found.');
			}

			switch (application.status) {
				case 'DELETED': {
					return reply.badRequest('Application already deleted.');
				}
				case 'INACTIVE':
				case 'ACTIVE': {
					break;
				}
			}

			const trx = await Application.startTransaction();

			try {
				await application.$query(trx).patch({
					status: 'DELETED',
					deletedBy: 'USER',
					deletedById: accountId,
					deletedAt: new Date(),
				});

				const client = await Client.query(trx)
					.findOne({ applicationId })
					.patchAndFetch({
						status: 'DELETED',
						deletedBy: 'USER',
						deletedById: accountId,
						deletedAt: new Date(),
					});

				const [clientRepresentation] =
					await fastify.keycloak.admin.clients.find({
						clientId: client.name,
					});

				if (!clientRepresentation) {
					throw new Error('Client not found in Keycloak.');
				}

				await fastify.keycloak.admin.clients.update(
					{
						id: clientRepresentation.id!,
					},
					{ enabled: false },
				);

				await trx.commit();

				return reply
					.status(200)
					.send({ success: true, message: 'Application deleted.' });
			} catch (error) {
				fastify.log.error(
					error,
					'An error occured while attempting to delete an Application.',
				);
				await trx.rollback();
				return reply.internalServerError();
			}
		},
	});
}
