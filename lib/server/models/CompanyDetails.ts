import { JSONSchema } from 'objection';
import BaseModel from './Base';

export default class CompanyDetails extends BaseModel {
	id!: string;
	accountId!: string;
	details!: Record<string, string | number | boolean | Date>;
	createdAt!: string | Date;
	updatedAt!: string | Date;

	static override get tableName(): string {
		return 'CompanyDetails';
	}

	static override get jsonSchema(): JSONSchema {
		return {
			type: 'object',
			required: ['accountId', 'details'],

			properties: {
				id: { type: 'string', format: 'uuid' },
				accountId: { type: 'string', format: 'uuid' },
				details: { type: 'object', properties: {} },
				updatedAt: { type: 'string', format: 'date-time' },
				createdAt: { type: 'string', format: 'date-time' },
			},
		};
	}

	static override get relationMappings() {
		return {
			account: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: 'Account',
				join: {
					from: 'CompanyDetails.accountId',
					to: 'Account.id',
				},
			},
		};
	}
}
