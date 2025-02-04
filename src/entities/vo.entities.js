export class RestBean {
    constructor(code, message, data, errors = []) {
        this.code = code;
        this.message = message;
        this.data = data || null;
        this.errors = errors || [];
    }

    static success(data = null, message = 'Success') {
        return new RestBean(200, message, data);
    }

    static error(code = 500, message = 'Error') {
        return new RestBean(code, message, null);
    }

    static fromErrorArray(errors) {
        return new RestBean(400, 'Bad Request', null, errors);
    }

    static custom(code, message, data = null) {
        return new RestBean(code, message, data);
    }
}