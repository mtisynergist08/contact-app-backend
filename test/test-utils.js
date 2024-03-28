import {prismaClient} from "../src/application/database.js";
import bcrypt from "bcrypt";

export const remove_user = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'Tarmizi'
        }
    })
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: 'Tarmizi',
            password: await bcrypt.hash('123456', 10),
            name: 'Tarmizi Ismail',
            token: '123456'
        }
    })
}

export const getUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: 'Tarmizi'
        }
    });
}

export const removeAllTestContacts = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            username: 'Tarmizi'
        }
    })
}

export const createTestContact = async () => {
    await prismaClient.contact.create({
        data: {
            username: 'Tarmizi',
            first_name: 'Tarmizi',
            last_name: 'Ismail',
            email: 'tarmizi@me.com',
            phone: '08123456789'
        }
    })
}

export const createTestContactMany = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.contact.create({
            data: {
                username: 'Tarmizi',
                first_name: `Tarmizi ${i}`,
                last_name: `Ismail ${i}`,
                email: `tarmizi${i}@me.com`,
                phone: `08123456789${i}`
            }
        })
    }
}

export const getTestContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: 'Tarmizi'
        }
    })
}

export const removeAllTestAddresses = async () => {
    await prismaClient.address.deleteMany({
        where: {
            contact: {
                username: 'Tarmizi'
            }
        }
    });
}

export const createTestAddress = async () => {
    const contact = await getTestContact();
    await prismaClient.address.create({
        data: {
            contact_id: contact.id,
            street: 'Jalan PR1MA 33',
            city: 'Sungai Petani',
            province: 'Kedah',
            country: 'Malaysia',
            postal_code: '08000'
        }
    })
}

export const getTestAddress = async () => {
    return prismaClient.address.findFirst({
        where: {
            contact: {
                username: 'Tarmizi'
            }
        }
    })
}