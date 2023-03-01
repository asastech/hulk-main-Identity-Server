import { JSONSchema } from 'objection';
import BaseModel from './Base';

export default class Application extends BaseModel {
	id!: string;
	accountId!: string;
	name!: string;
	status!: 'ACTIVE' | 'INACTIVE' | 'DELETED';
	deletedBy?: 'USER' | 'SYSTEM' | 'ADMIN';
	deletedById?: string;
	createdAt!: string | Date;
	deletedAt?: string | Date;

	static override get tableName(): string {
		return 'Application';
	}

	static override get jsonSchema(): JSONSchema {
		return {
			type: 'object',
			required: ['accountId', 'name'],

			properties: {
				id: { type: 'string', format: 'uuid' },
				accountId: { type: 'string', format: 'uuid' },
				name: { type: 'string' },
				status: {
					type: 'string',
					enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
				},
				deletedBy: { type: 'string', enum: ['USER', 'SYSTEM', 'ADMIN'] },
				deletedById: { type: 'string', format: 'uuid' },
				createdAt: { type: 'string', format: 'date-time' },
				deletedAt: { type: 'string', format: 'date-time' },
			},
		};
	}

	static override get relationMappings() {
		return {
			account: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: 'Account',
				join: {
					from: 'Application.accountId',
					to: 'Account.id',
				},
			},
			client: {
				relation: BaseModel.HasOneRelation,
				modelClass: 'Client',
				join: {
					from: 'Application.id',
					to: 'Client.applicationId',
				},
			},
		};
	}
}
