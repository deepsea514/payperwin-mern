const mongoose = require('mongoose');
const { Schema } = mongoose;
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcrypt');

const AdminSchema = new Schema(
    {
        username: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true },
        email: { type: String, required: true, index: { unique: true } },
        phone: { type: String, default: null },
        _2fa_enabled: { type: Boolean, default: true },
        role: { type: String, default: 'Customer Service' },
        twoFactorAuthenticationCode: String,
        otpauthUrl: String,
    }
);

AdminSchema.pre('save', function (next) { // eslint-disable-line func-names
    const user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, (err2, hash) => {
            if (err2) return next(err2);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

AdminSchema.methods.comparePassword = function (candidatePassword, callback) { // eslint-disable-line func-names
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

AdminSchema.methods.validPassword = function (candidatePassword) { // eslint-disable-line func-names
    return bcrypt.compare(candidatePassword, this.password);
};


const Admin = mongoose.model('admin', AdminSchema);

module.exports = Admin;
