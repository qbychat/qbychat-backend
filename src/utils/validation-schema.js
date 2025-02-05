export const loginSchema = {
    username: {
        notEmpty: true,
        trim: true,
        matches: {options: /^[A-Za-z0-9_]+$/}, // Only allows A-Z, a-z, 0-9, and _
        errorMessage: 'Username must contain only letters, numbers, and underscores'
    },
    password: {
        notEmpty: true,
        errorMessage: 'Password should not be empty'
    }
};

export const registerSchema = {
    username: {
        notEmpty: true,
        trim: true,
        matches: {options: /^[A-Za-z0-9_]+$/}, // Only allows A-Z, a-z, 0-9, and _
        errorMessage: 'Username must contain only letters, numbers, and underscores'
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
            errorMessage: 'Session ID must be a string'
        },
    }
}

export const createBotSchema = {
    username: {
        notEmpty: true,
        trim: true,
        matches: {
            options: /^[A-Za-z0-9_]+_bot$/ // Only allows A-Z, a-z, 0-9, and _; must end with "_bot"
        },
        errorMessage: 'Username must contain only letters, numbers, underscores, and end with \'_bot\''
    }
}


export const resetPasswordSchema = {
    password: {
        notEmpty: true,
        errorMessage: 'Password should not be empty'
    },
    newPassword: {
        notEmpty: true,
        errorMessage: 'New password should not be empty'
    }
}

export const deleteBotSchema = {
    bot: {
        notEmpty: true,
        errorMessage: 'Bot id should not be empty'
    }
}