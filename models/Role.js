const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    roles: {
        type: String,
        required: true,
        unique: true
    },
    level: {
        type: Number,
        required: true,
        unique: true
    }
    
},
    {timestamps: true}
)

module.exports = mongoose.model('Role', roleSchema)