const mongoose = require("mongoose")
const ContactSchema = mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId, ref:"User", required:true},
    contacts:[{type:mongoose.Types.ObjectId, ref:"User", required:true}]
})

const Contact = mongoose.model("Contact", ContactSchema)

module.exports = Contact