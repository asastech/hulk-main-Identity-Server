import { JSONSchema } from 'objection';
import BaseModel from './Base';

export default class Account extends BaseModel {
	id!: string;
	username!: string;
	email!: string;
	passwordHash!: string;
	status!: 'UNVERIFIED' | 'VERIFIED' | 'BANNED' | 'DELETED';
	deletedBy?: 'USER' | 'SYSTEM' | 'ADMIN';
	deletedById?: string;
	createdAt!: string | Date;
	updatedAt!: string | Date;
	deletedAt?: string | Date;

	static override get tableName(): string {
		return 'Account';
	}

	static override get jsonSchema(): JSONSchema {
		return {
			type: 'object',
			required: ['id', 'username', 'passwordHash', 'email'],

			properties: {
				id: { type: 'string', format: 'uuid' },
				username: { type: 'string' },
				passwordHash: { type: 'string' },
				email: { type: 'string', format: 'email' },
				status: {
					type: 'string',
					enum: ['UNVERIFIED', 'VERIFIED', 'BANNED', 'DELETED'],
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
			applications: {
				relation: BaseModel.HasManyRelation,
				modelClass: 'Application',
				join: {
					from: 'Account.id',
					to: 'Application.accountId',
				},
			},
			companyDetails: {
				relation: BaseModel.HasOneRelation,
				modelClass: 'CompanyDetails',
				join: {
					from: 'Account.id',
					to: 'CompanyDetails.accountId',
				},
			},
		};
	}
}
