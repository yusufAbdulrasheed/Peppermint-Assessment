import joi from 'joi'

const generateApiKeySchema = joi.object({
    name: joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.base": "Name must be a string",
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name must be at most 50 characters"
        })
})

export { generateApiKeySchema }