import * as Joi from "joi"

const durationRegex = /^\d+[smhd]$/;
export const validationSchema = Joi.object({
  APP_PORT: Joi.number().default(3000),
  DB_URL: Joi.string().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRED_DURATION: Joi.string().default("2h").pattern(durationRegex).messages({
    'string.pattern.base': '"JWT_EXPIRED_DURATION" must be in the format of [number][s|m|h|d]'
  }),
  JWT_REFRESH_SECRET_KEY: Joi.string().required(),
  JWT_REFRESH_EXPIRED_DURATION: Joi.string().default("7d").pattern(durationRegex).messages({
    'string.pattern.base': '"JWT_REFRESH_EXPIRED_DURATION" must be in the format of [number][s|m|h|d]'
  }),
  BC_RPC_PROVIDER: Joi.string().required(),
  BC_CHAIN_ID: Joi.number().required(),
  BC_OWNER_PRIVATE_KEY: Joi.string().required(),
  BC_OWNER_ADDRESS: Joi.string().required().length(42),
  SC_ADMINABLE: Joi.string().required(),
  SC_GENERAL_USER_LOGGING: Joi.string().required(),
  CPT_ALGORITHM_KEY: Joi.string().default("aes-256-cbc"),
  CPT_ENCRYPTION_KEY: Joi.string().required(),
  CPT_IV_KEY: Joi.string().required(),
})