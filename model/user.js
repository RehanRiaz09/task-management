const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
userName: {type: String, required: true},
email: {type: String, required: true},
password: {type: String, required: true, minlength: 8}
})
module.exports = mongoose.model("User", userSchema)