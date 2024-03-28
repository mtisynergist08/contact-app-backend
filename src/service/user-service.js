import {validate} from "../validation/validate.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    updateUserValidation
} from "../validation/user-validation.js";
import {prismaClient} from "../application/database.js";
import {ResponseError} from "../errors/response-error.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid"


const registerUser = async (request) => {
    const user = validate(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        {
            throw new ResponseError(400, "Username already exists");
        }
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    })
};

const userLogin = async (request) => {
    const loginRequest = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username,
        },
        select: {
            username: true,
            password: true
        }
    })

    if (!user) {
        throw new ResponseError(401, "Username or password invalid");
    }

    const isPasswordMatch = await bcrypt.compare(loginRequest.password, user.password);

    if (!isPasswordMatch) {
        throw new ResponseError(401, "Username or password invalid");
    }

    const token = uuid().toString();

    return prismaClient.user.update({
        data: {
            token
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    })

};

const getUser = async (username) => {
    username = validate(getUserValidation, username);
    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    return user
}

const updateUser = async (request) => {
    const user = validate(updateUserValidation, request);

    const userTotalInDatabase = await prismaClient.user.count({
        where: {
            username: user.username
        },
    });

    if (userTotalInDatabase === 0) {
        throw new ResponseError(404, "User not found");
    }

    const data = {}

    if (user.name) {
        data.name = user.name
    }

    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10)
    }

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data,
        select: {
            username: true,
            name: true
        }
    })
}

const logoutUser = async (username) => {
    username = validate(getUserValidation, username);
    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }
    return prismaClient.user.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    });
}

export default {
    registerUser,
    userLogin,
    getUser,
    updateUser,
    logoutUser
}