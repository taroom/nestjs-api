import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import * as bcrypt from 'bcrypt';
import { Address, User } from "@prisma/client";
import { Contact } from "generated/prisma";

@Injectable()
export class TestService {
    constructor(
        private prismaService: PrismaService
    ) { }

    // persiapan untuk delete user
    async deleteAll() {
        await this.deleteContact();
        await this.deleteUser();
    }




    async getUser(): Promise<User> {
        return this.prismaService.user.findUnique({
            where: {
                username: 'taroom'
            }
        });
    }

    async createUser() {
        await this.prismaService.user.create({
            data: {
                username: 'taroom',
                name: 'Agus Sutarom',
                password: await bcrypt.hash('taroom', 10),
                token: 'test'
                // token: uuid()
            }
        })
    }

    async deleteUser() {
        const userDelete = await this.prismaService.user.deleteMany({
            where: {
                username: 'taroom'
            }
        });

        if (userDelete.count > 0) {
            console.log('User deleted');
        } else {
            console.log('No user found to delete');
        }
    }

    async getContact(): Promise<Contact> {
        return this.prismaService.contact.findFirst({
            where: {
                username: 'taroom'
            }
        });
    }

    async createContact() {
        await this.prismaService.contact.create({
            data: {
                first_name: 'Agus',
                last_name: 'Sutarom',
                email: 'taroom@gmail.com',
                phone: '08123456789',
                username: 'taroom'
            }
        });
    }

    async deleteContact() {
        const contactDelete = await this.prismaService.contact.deleteMany({
            where: {
                username: 'taroom'
            }
        });

        if (contactDelete.count > 0) {
            console.log('Contact deleted');
        } else {
            console.log('No contact found to delete');
        }
    }

    async createAddress() {
        const contact = await this.getContact();
        await this.prismaService.address.create({
            data: {
                contact_id: contact.id, // assuming contact_id is 1 for testing
                street: 'Raya Merdeka',
                city: 'Tuban',
                province: 'Jawa Timur',
                country: 'Indonesia',
                postal_code: '62355'
            }
        });
    }

    async deleteAddress() {
        const addressDelete = await this.prismaService.address.deleteMany({
            where: {
                user_contacts: {
                    username: 'taroom'
                }
            }
        });

        if (addressDelete.count > 0) {
            console.log('Address deleted');
        } else {
            console.log('No address found to delete');
        }
    }

    async getAddress(): Promise<Address> {
        return this.prismaService.address.findFirst({
            where: {
                user_contacts: {
                    username: 'taroom'
                }
            }
        });
    }
} 