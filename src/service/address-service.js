import {prismaClient} from "../application/database.js";
import {validate} from "../validation/validate.js";
import {getContactValidation} from "../validation/contact-validation.js";
import {ResponseError} from "../errors/response-error.js";
import {
    createAddressValidation,
    getAddressValidation,
    updateAddressValidation
} from "../validation/address-validation.js";

const checkContactExisted = async (user, contact_id) => {
    contact_id = validate(getContactValidation, contact_id)
    const totalCountContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id: contact_id
        }
    });

    if (totalCountContact !== 1) {
        throw new ResponseError(404, 'Contact not found');
    }

    return contact_id;
}

const createAddress = async (user, contact_id, request) => {
    contact_id = await checkContactExisted(user, contact_id)
    const address = validate(createAddressValidation, request);
    address.contact_id = contact_id;

    return prismaClient.address.create({
        data: address,
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });
}

const getAddress = async (user, contact_id, addressId) => {
    contact_id = await checkContactExisted(user, contact_id);
    addressId = validate(getAddressValidation, addressId);

    const address = await prismaClient.address.findFirst({
        where: {
            contact_id,
            id: addressId,
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    });
    if (!address) {
        throw new ResponseError(404, 'Address not found');
    }

    return address;
}

const updateAddress = async (user, contact_id, request) => {
    contact_id = await checkContactExisted(user, contact_id);

    const address = validate(updateAddressValidation, request);

    const countAddressInDatabase = await prismaClient.address.count({
        where: {
            contact_id,
            id: address.id
        }
    });

    if (countAddressInDatabase !== 1) {
        throw new ResponseError(404, 'Address not found');
    }

    return prismaClient.address.update({
        where: {
            contact_id,
            id: address.id
        },
        data: {
            street: address.street,
            city: address.city,
            province: address.province,
            country: address.country,
            postal_code: address.postal_code
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })
}

const removeAddress = async (user, contact_id, addressId) => {
    contact_id = await checkContactExisted(user, contact_id);

    addressId = validate(getAddressValidation, addressId);

    const countAddressInDatabase = await prismaClient.address.count({
        where: {
            contact_id,
            id: addressId
        }
    });

    if (countAddressInDatabase !== 1) {
        throw new ResponseError(404, 'Address not found');
    }

    return prismaClient.address.delete({
        where: {
            contact_id,
            id: addressId
        }
    })
}

const listAddress = async (user, contact_id) => {
    contact_id = await checkContactExisted(user, contact_id);
    return prismaClient.address.findMany({
        where: {
            contact_id
        },
        select: {
            id: true,
            street: true,
            city: true,
            province: true,
            country: true,
            postal_code: true
        }
    })
}
export default {
    createAddress,
    getAddress,
    updateAddress,
    removeAddress,
    listAddress
}