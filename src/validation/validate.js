/** @format */

import {ResponseError} from "../errors/response-error.js";

const validate = (schema, request) => {
    const response = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
    });

    if (response.error) {
        throw new ResponseError(400, response.error.message);
    } else {
        return response.value;
    }
};

export {validate};
