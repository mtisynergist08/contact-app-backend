import userService from "../service/user-service.js";


const register = async (req, res, next) => {
    try {
        const results = await userService.registerUser(req.body);
        res.status(201).json({
            data: results
        });
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const results = await userService.userLogin(req.body);
        res.status(200).json({
            data: results
        })
    } catch (error) {
        next(error)
    }
}

const get = async (req, res, next) => {
    try {
        const username = req.user.username;
        const results = await userService.getUser(username);
        res.status(200).json({
            data: results
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;
        request.username = username;

        const results = await userService.updateUser(request);

        res.status(200).json({
            data: results
        }).end();

    } catch (e) {
        next(e);
    }
}

const logout = async (req, res, next) => {
    try {
        await userService.logoutUser(req.user.username);
        res.status(200).json({data: "OK"}).end();
    } catch (e) {
        next(e)
    }
}

export default {
    register,
    login,
    get,
    update,
    logout
}