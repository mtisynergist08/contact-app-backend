import addressService from '../service/address-service.js';

const create = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const contact_id = req.params.contact_id;

        const results = await addressService.createAddress(user, contact_id, request);
        res.status(200).json({
            data: results,
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {

        const user = req.user;
        const contact_id = req.params.contact_id;
        const addressId = req.params.addressId;

        const results = await addressService.getAddress(user, contact_id, addressId);
        res.status(200).json({
            data: results,
        });

    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const user = req.user;
        const contact_id = req.params.contact_id;
        const addressId = req.params.addressId;
        const request = req.body;
        request.id = addressId;

        const results = await addressService.updateAddress(user, contact_id, request);

        res.status(200).json({
            data: results,
        });
    } catch (e) {
        next(e);
    }

}

const remove = async (req, res, next) => {
    try {
        const user = req.user;
        const contact_id = req.params.contact_id;
        const addressId = req.params.addressId;


        const results = await addressService.removeAddress(user, contact_id, addressId);

        res.status(200).json({
            data: "OK",
        });
    } catch (e) {
        next(e);
    }
}

const list = async (req, res, next) => {
    try {
        const user = req.user;
        const contact_id = req.params.contact_id;

        const results = await addressService.listAddress(user, contact_id);

        res.status(200).json({
            data: results,
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    get,
    update,
    remove,
    list
}