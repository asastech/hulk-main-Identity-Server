import { Model, mixin, AjvValidator, Validator } from 'objection';
import { DBErrors } from 'objection-db-errors';
import applyFormats from 'ajv-formats';

export default class BaseModel extends mixin(Model, [DBErrors]) {
	static override get modelPaths(): string[] {
		return [__dirname];
	}

	static override createValidator(): Validator {
		return new AjvValidator({
			onCreateAjv(ajv) {
				applyFormats(ajv);
			},
			options: {
				allErrors: true,
				removeAdditional: 'all',
				useDefaults: true,
				coerceTypes: true,
				validateSchema: true,
				ownProperties: true,
			},
		});
	}

	override $beforeValidate(jsonSchema: any, json: Record<string, any>) {
		// Converts Javascript Date objects into their corresponding ISO Strings
		Object.entries(jsonSchema.properties).forEach(([prop, schema]: any) => {
			if (['date', 'date-time'].includes(schema.format)) {
				if (
					typeof json[`${prop}`] === 'object' &&
					json[`${prop}`] instanceof Date
				) {
					json[`${prop}`] = json[`${prop}`].toISOString();
				} else if (typeof json[`${prop}`] === 'number') {
					json[`${prop}`] = new Date(json[`${prop}`]).toISOString();
				}
			}
		});

		return jsonSchema;
	}

	override $parseDatabaseJson(json: Record<string, any>) {
		json = super.$parseDatabaseJson(json);

		// Converts ISO8601 strings into Javascript Date objects
		Object.entries((this as any).constructor.jsonSchema.properties).forEach(
			([prop, schema]: any) => {
				if (['date-time', 'date'].includes(schema.format)) {
					json[`${prop}`] = json[`${prop}`] && new Date(json[`${prop}`]);
				}
			},
		);

		return json;
	}
}
