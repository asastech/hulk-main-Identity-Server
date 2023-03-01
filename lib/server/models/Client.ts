import { JSONSchema } from 'objection';
import BaseModel from './Base';

export default class Client extends BaseModel {
	id!: string;
	applicationId!: string;
	name!: string;
	baseUrl!: string;
	type!: 'PUBLIC' | 'CONFIDENTIAL';
	secret!: string;
	status!: 'CREATED' | 'DISABLED' | 'DELETED';
	deletedBy?: 'USER' | 'SYSTEM' | 'ADMIN';
	deletedById?: string;
	createdAt!: string | Date;
	updatedAt!: string | Date;
	deletedAt?: string | Date;

	static override get tableName(): string {
		return 'Client';
	}

	static override get jsonSchema(): JSONSchema {
		return {
			type: 'object',
			required: ['applicationId', 'name', 'baseUrl', 'type', 'secret'],

			properties: {
				id: { type: 'string', format: 'uuid' },
				applicationId: { type: 'string', format: 'uuid' },
				name: { type: 'string' },
				baseUrl: { type: 'string', format: 'uri' },
				type: { type: 'string', enum: ['PUBLIC', 'CONFIDENTIAL'] },
				secret: { type: 'string' },
				status: {
					type: 'string',
					enum: ['CREATED', 'DISABLED', 'DELETED'],
				},
				deletedBy: { type: 'string', enum: ['USER', 'SYSTEM', 'ADMIN'] },
				deletedById: { type: 'string', format: 'uuid' },
				updatedAt: { type: 'string', format: 'date-time' },
				createdAt: { type: 'string', format: 'date-time' },
				deletedAt: { type: 'string', format: 'date-time' },
			},
		};
	}

	static override get relationMappings() {
		return {
			application: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: 'Application',
				join: {
					from: 'Client.applicationId',
					to: 'Application.id',
				},
			},
		};
	}
}
