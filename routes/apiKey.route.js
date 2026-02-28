import express from 'express'
import ApiKeyController from '../controller/apiKey.Controller'
import authMiddleware from '../middlewares/auth.middleware'
import { generateApiKeySchema } from '../validations/apiKey.validation'
import validate from '../middlewares/validation.middleware'

const router = express.Router()

router.post('/generate', authMiddleware, validate(generateApiKeySchema), ApiKeyController.generate)
router.get('/list', authMiddleware, ApiKeyController.list)
router.delete('/revoke/:keyId', authMiddleware, ApiKeyController.revoke)
router.post('/rotate/:keyId', authMiddleware, ApiKeyController.rotate)

export default router