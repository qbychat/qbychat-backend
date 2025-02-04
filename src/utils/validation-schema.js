export const loginSchema = {
    username: {
        notEmpty: true,
        trim: true
    },
    password: {
        notEmpty: true,
    }
};

export const registerSchema = {
    username: {
        notEmpty: true,
        trim: true
    },
    password: {
        notEmpty: true,
    }
}

export const logoutSchema = {
    session: {
        optional: true,
        trim: true,
        isString: {
            errorMessage: "Session ID must be a string"
        },
    }
}