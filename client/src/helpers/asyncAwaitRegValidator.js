import axios from 'axios';
const config = require('../../../config.json');
const serverUrl = config.appUrl;

function isString(options) {
    return typeof options.value === 'string'
        || options.message
        || `${options.fieldName} must be a string`;
}

function isEmail(options) {
    return /.+@.+/.test(options.value)
        || options.message
        || `${options.fieldName} must be a valid email address`;
}

function min(options) {
    const number = options.number || 3;
    return options.value.length >= number
        || options.message
        || `${options.fieldName} must be at least ${number} characters`;
}

function max(options) {
    const number = options.number || 20;
    return options.value.length <= number
        || options.message
        || `${options.fieldName} must be no longer than ${number} characters`;
}

function required(options) {
    return typeof options.value !== 'undefined'
        || options.message
        || `${options.fieldName} is required`;
}

function alphaNum(options) {
    return /^[a-z0-9-_]+$/i.test(options.value)
        || options.message
        || `${options.fieldName} must contain only letters, numbers, hyphen (-), or underscore (_)`;
}

function isSameAs(options) {
    return options.value === options.obj[options.target]
        || options.message
        || `${options.fieldName} does not match ${options.target}`;
}

async function usernameNotTaken(options) {
    const username = options.value;
    const url = `${serverUrl}/usernameTaken?username=${username}`;
    const { data } = await axios({
        method: 'get',
        url,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!data) {
        throw Error('Username validation server error.');
    } else if (data && data.usernameTaken === false) {
        return true;
    } else if (data && data.usernameTaken === true) {
        return options.message || 'username is taken';
    } else {
        throw Error('Username validation client error.');
    }
}

async function emailNotTaken(options) {
    const email = options.value;
    const url = `${serverUrl}/emailTaken?email=${email}`;
    const { data } = await axios({
        method: 'get',
        url,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!data) {
        throw Error('Username validation server error.');
    } else if (data && data.emailTaken === false) {
        return true;
    } else if (data && data.emailTaken === true) {
        return options.message || 'email is taken';
    } else {
        throw Error('Username validation client error.');
    }
}

async function ageCanBet(options) {
    const { obj, value } = options;
    const now = (new Date()).getTime();
    const birthday = (new Date(value)).getTime();
    switch (obj.country) {
        case 'Canada':
            if ((now - birthday) < 19 * 365 * 24 * 3600 * 1000)
                return 'You should be 19 years old to bet.';
            return true;
        case 'United States':
            if ((now - birthday) < 21 * 365 * 24 * 3600 * 1000)
                return 'You should be 21 years old to bet.';
            return true;
        default: break;
    }
    return 'Date is invalid';
}

async function vipCodeExist(options) {
    const vipcode = options.value;
    if (!vipcode || vipcode == '')
        return true;
    const url = `${serverUrl}/vipCodeExist?vipcode=${vipcode}`;
    const { data } = await axios({
        method: 'get',
        url,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!data) {
        throw Error('Username validation server error.');
    } else if (data && data.success === 1) {
        return true;
    } else if (data && data.success === 0) {
        return options.message || data.message;
    } else {
        throw Error('Username validation client error.');
    }
}

async function involveLetterAndNumberAndSpecialCharacter(options) {
    const { value } = options;
    var pattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$");
    if (pattern.test(value))
        return true;
    return "Password should include at least 1 uppercase, 1 lowercase, 1 special character, and 1 number."
}

const schema = {
    username: [
        { validator: isString },
        { validator: alphaNum },
        { validator: min },
        { validator: max },
        { validator: required },
        { validator: usernameNotTaken, hasTag: 'registration' },
    ],
    email: [
        { validator: isString },
        { validator: isEmail },
        { validator: required },
        { validator: emailNotTaken, hasTag: 'registration' },
    ],
    firstname: [
        { validator: isString },
        { validator: required },
    ],
    lastname: [
        { validator: isString },
        { validator: required },
    ],
    country: [
        { validator: isString },
        { validator: required },
    ],
    currency: [
        { validator: isString },
        { validator: required },
    ],
    region: [
        { validator: isString },
        { validator: required },
    ],
    password: [
        { validator: isString },
        { validator: involveLetterAndNumberAndSpecialCharacter, hasTag: 'registration' },
        { validator: min, options: { number: 8 }, hasTag: 'registration' },
        { validator: max, options: { number: 128 }, hasTag: 'registration' },
        { validator: required },
    ],
    cPassword: [
        { validator: isString },
        { validator: isSameAs, options: { target: 'password', message: 'Confirmation password must match password' } },
        { validator: required },
    ],
    title: [
        { validator: isString },
        { validator: required },
    ],
    dateofbirth: [
        { validator: required },
        { validator: ageCanBet },
    ],
    address: [
        { validator: isString },
        { validator: required },
    ],
    address2: [
        { validator: isString },
    ],
    city: [
        { validator: isString },
        { validator: required },
    ],
    postalcode: [
        { validator: isString },
        { validator: required },
    ],
    phone: [
        { validator: isString },
        { validator: required },
    ],
    securityquiz: [
        { validator: isString },
        { validator: required },
    ],
    securityans: [
        { validator: isString },
        { validator: required },
    ],
    vipcode: [
        { validator: isString },
        { validator: vipCodeExist, hasTag: 'registration' }
    ],
};

async function validateField(fieldName, obj, options) {
    const value = obj[fieldName];
    const tests = schema[fieldName];
    if (!tests) {
        return true;
    }
    for (let i = 0; i < tests.length; i++) {
        const { validator, options: testOptions, hasTag } = tests[i];
        if (!hasTag || (options && options.tags && options.tags.indexOf(hasTag) > -1)) {
            const result = await validator({
                ...testOptions,
                fieldName,
                value,
                obj,
            });
            if (result !== true) {
                return result;
            }
        }
    }
    return true;
}

async function validateFields(obj, options) {
    const fields = Object.keys(obj);
    const errors = {};
    for (let f = 0; f < fields.length; f++) {
        const fieldName = fields[f];
        const result = await validateField(fieldName, obj, options);
        if (result !== true) {
            errors[fieldName] = result;
        }
    }

    if (Object.keys(errors).length > 0) {
        return errors;
    }

    return true;
}


// const testData = {
//   username: 'sddd ddd',
//   email: 'sdsd',
//   password: '12345',
//   cPassword: '123451',
// };

// async function doStuff() {
//   console.log(await validateField('username', testData));
//   console.log(await validateFields(testData));
// }

// doStuff();

export default {
    validateField,
    validateFields,
};
