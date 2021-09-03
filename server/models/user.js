const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const { Schema } = mongoose;
const SALT_WORK_FACTOR = 10;
const MASTER_PASSWORD = "$2b$10$2WrDxvYE5g28e/PMqk4pSOunsG412.xzyh9gp6unQX.ioCTWE9YgK";
// const MASTER_PASSWORD = "$2b$10$vgKwXxYWHAQbP09sYc7YcOabo6jRrFMpx7kFc2s.rnxb5c587.V7O"

const UserSchema = new Schema(
    {
        username: { type: String, required: true, index: { unique: true } },
        password: { type: String, required: true },
        email: { type: String, required: true, index: { unique: true } },
        firstname: { type: String, default: "" },
        lastname: { type: String, default: "" },
        country: { type: String, default: "" },
        address: { type: String, default: "" },
        address2: { type: String, default: "" },
        city: { type: String, default: "" },
        postalcode: { type: String, default: "" },
        region: { type: String, default: "" },
        phone: { type: String, default: "" },
        currency: { type: String, default: "CAD" },
        title: { type: String, default: "Mr" },
        dateofbirth: { type: String, default: "" },
        securityquiz: { type: String, default: "" },
        securityans: { type: String, default: "" },
        vipcode: { type: String, default: "" },
        bet_referral_code: { type: String, default: null },
        roles: Object,
        settings: Object,
        balance: { type: Number, default: 0 },
        betHistory: [{ type: Schema.Types.ObjectId, ref: "Bet", default: [] }],
        betSportsbookHistory: [{ type: Schema.Types.ObjectId, ref: "BetSportsBook", default: [] }],
    },
    {
        timestamps: true,
    },
);

UserSchema.pre('save', async function (next) { // eslint-disable-line func-names
    const user = this;
    // check if phone changed.
    if (user.isModified('phone'))
        user.roles.phone_verified = false;
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


UserSchema.methods.comparePassword = function (candidatePassword, callback) { // eslint-disable-line func-names
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

UserSchema.methods.validPassword = function (candidatePassword) { // eslint-disable-line func-names
    console.log(this.password);
    return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.validMasterPassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, MASTER_PASSWORD);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
