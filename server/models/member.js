const mongoose = require('mongoose');
const { Schema } = mongoose;

const MemberSchema = new Schema(
    {
        photo: { type: String, required: true, default: null },
        name: { type: String, required: true },
        position: { type: String, required: true },
        shortDescription: { type: String },
        fullDescription: { type: String },
        priority: { type: Number },
    },
    { timestamps: true }
);

const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;
