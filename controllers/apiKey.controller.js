import ApiKeyService from "../services/apiKey.service"

class ApiKeyController {
    static async generate(req, res, next){
        try{
            const { name } = req.body

            const result = await ApiKeyService.generateKey(req.user._id, name)

            return res.status(201).json({
                success: true,
                data: result
            })
        }catch(error){
            next(error)
        }
    }

    static async list(req, res, next){
        try{
            const keys = await ApiKeyService.getKeys(req.user._id)

            return res.status(200).json({
                success: true,
                data: keys
            })
        }catch(error){
            next(error)
        }
    }

    static async revoke(req, res, next){
        try{

             const { keyId } = req.params

            const result = await ApiKeyService.revokeKey(req.user._id, keyId)

            return res.status(200).json({
            success: true,
            message: result.message
            })

        }catch(error){
            next(error)
        }
    }

    static async rotate(req, res, next){
        try{
            const { keyId } = req.params

            const result = await ApiKeyService.rotateKey(req.user._id, keyId)

            return res.status(200).json({
                success: true,
                data: result
            })
        }catch(error){
            next(error)
        }
    }
}

export default ApiKeyController