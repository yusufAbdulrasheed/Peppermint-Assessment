import ApiKey from '../models/apiKey.model'
import crypto from 'crypto-js'
import AppError from '../utils/appError'

class ApiKeyService {
    static async createKey(userId, name){
        const activeKeysCount = await ApiKey.countDocuments({
            user: userId,
            active: true,
        })

        if(activeKeysCount >= 3){
            throw new Error("Maximum of 3 active API keys allowed")
            throw new AppError("Maximum of 3 active API keys allowed", 400)
        }

        const rawKey = crypto.randomBytes(32).toString("hex")

        const keyHash = crypto
            .createHash("sha256")
            .update(rawKey)
            .digest("hex")

        const apikey = await ApiKey.create({
            user: userId,
            name,
            key: keyHash,
            active: true,
        })

        return{
            id: apikey._id,
            name: apikey.name,
            key: rawKey,
            createdAt: apikey.createdAt
        }
    }

    static async getKeys(userId){
        const keys = await ApiKey.find({
            user: userId
        }).select("-keyHash").sort({ createdAt: -1})

        return keys
    }

    static async revokeKey(userId, keyId){
        const apiKey = await ApiKey.findOne({
            _id: keyId,
            user: userId
        })

        if(!apiKey){
            throw new AppError("API key not found", 404)
        }

        if(!apiKey.isActive){
            throw new AppError("API key is already revoked", 400)
        }

        apiKey.isActive = false
        await apiKey.save()

        return { message: "API key revoked successfully"}
    }

    static async rotateKey(userId, KeyId){
        const oldKey = await ApiKey.findOne({
            _id: keyId,
            user: userId,
            isActive: true
        })

        if (!oldKey){
            throw new AppError("Active API key not found", 404)
        }

        // Generate New Key
        const rawKey = crypto.randomBytes(32).toString("hex")

        const keyHash = crypto
            .createHash("sha256")
            .update(rawKey)
            .digest("hex")
        
        const newKey = await ApiKey.create({
            user: userId,
            name: oldKey.name,
            keyHash,
            isActive: true,
        })

        // Revoke Old Key
        oldKey.isActive = false
        await oldKey.save()

        return {
            id: newKey._id,
            name: newKey.name,
            key: rawKey,
            message: "API key rotated successfully"
        }
    }
}

export default ApiKeyService