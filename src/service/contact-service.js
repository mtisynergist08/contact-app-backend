import {validate} from "../validation/validate.js";
import {prismaClient} from "../application/database.js";
import {
    createContactValidation,
    getContactValidation, searchContactValidation,
    updateContactValidation
} from "../validation/contact-validation.js";
import {ResponseError} from "../errors/response-error.js";
import {logger} from "../application/logging.js";


const createContact = async (user, request) => {
    logger.info(request);
    logger.info(user);
    const contact = validate(createContactValidation, request);
    contact.username = user.username;

    return prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });
};

const getContact = async (user, contact_id) => {
    contact_id = validate(getContactValidation, contact_id);

    const contact = await prismaClient.contact.findFirst({
        where: {
            username: user.username,
            id: contact_id
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });
    if (!contact) {
        throw new ResponseError(404, 'Contact not found');
    }

    return contact;
}

const updateContact = async (user, request) => {
    const contact = validate(updateContactValidation, request);

    const totalContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contact.id
        }
    });

    if (totalContact !== 1) {
        throw new ResponseError(404, 'Contact not found');
    }

    return prismaClient.contact.update({
        where: {
            id: contact.id
        },
        data: {
            first_name: contact.first_name,
            last_name: contact.last_name,
            email: contact.email,
            phone: contact.phone
        },
        select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true
        }
    });
}

const removeContact = async (user, contact_id) => {
    contact_id = validate(getContactValidation, contact_id);

    const contactTotalInDatabase = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contact_id
        }
    });
    if (contactTotalInDatabase !== 1) {
        throw new ResponseError(404, 'Contact not found');
    }
    return prismaClient.contact.delete({
        where: {
            id: contact_id
        }
    });
}

const searchContact = async (user, request) => {
    request = validate(searchContactValidation, request);

    // 1 ((page - 1) * size) = 0
    // 2 ((page - 1) * size) = 10
    const skip = (request.page - 1) * request.size;

    const filter = [];

    filter.push({
        username: user.username
    })

    if (request.name) {
        filter.push({
            OR: [
                {
                    first_name: {
                        contains: request.name
                    }
                },
                {
                    last_name: {
                        contains: request.name
                    }
                },
            ]
        });
    }

    if (request.email) {
        filter.push({
            email: {
                contains: request.email
            }
        });
    }

    if (request.phone) {
        filter.push({
            phone: {
                contains: request.phone
            }
        });
    }

    const contacts = await prismaClient.contact.findMany({
        where: {
            AND: filter,
        },
        take: request.size,
        skip: skip,
    });

    const totalItems = await prismaClient.contact.count({
        where: {
            AND: filter
        }
    });

    return {
        data: contacts,
        paging: {
            page: request.page,
            total_item: totalItems,
            total_page: Math.ceil(totalItems / request.size)
        }
    }
}

export default {
    createContact,
    getContact,
    updateContact,
    removeContact,
    searchContact
}