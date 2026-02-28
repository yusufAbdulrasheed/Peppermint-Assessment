import mongoose from "mongoose"

const accessLogSchema = new mongoose.Schema({
    apiKey: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApiKey",
    },

    ipAddress: String,
    endpoint: String,
    sucess: Boolean,
},

    { timestamps: true}
)

const AccessLog = mongoose.model("AccessLog", accessLogSchema)

export default AccessLog