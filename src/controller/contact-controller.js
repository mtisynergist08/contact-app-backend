import contactService from "../service/contact-service.js";

const create = async (req, res, next) => {
    try {
        const user = req.user;
        const request = req.body;
        const results = await contactService.createContact(user, request);
        res.status(200).json({
            data: results
        });
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contact_id;
        const results = await contactService.getContact(user, contactId);
        res.status(200).json({
            data: results
        });
    } catch (e) {
        next(e)
    }
}

const update = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contact_id;
        const request = req.body;
        request.id = contactId;

        const results = await contactService.updateContact(user, request);
        res.status(200).json({
            data: results
        });
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const user = req.user;
        const contactId = req.params.contact_id;

        await contactService.removeContact(user, contactId);
        res.status(200).json({
            data: "OK"
        });
    } catch (e) {
        next(e);
    }
}

const search = async (req, res, next) => {
    try {
        const user = req.user;
        const request = {
            name: req.query.name,
            email: req.query.email,
            phone: req.query.phone,
            page: req.query.page,
            size: req.query.size
        }

        const results = await contactService.searchContact(user, request);
        res.status(200).json({
            data: results.data,
            paging: results.paging
        });
    } catch (e) {
        next(e)
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}