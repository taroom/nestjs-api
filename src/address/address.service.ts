import { HttpException, Inject, Injectable } from "@nestjs/common";
import { Address, User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "src/common/prisma.service";
import { ValidationService } from "src/common/validation.service";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, UpdateAddressRequest } from "src/model/address.model";
import { Logger } from "winston";
import { AddressValidation } from "./address.validation";
import { ContactService } from "src/contact/contact.service";

@Injectable()
export class AddressService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService,
        private contactService: ContactService,// untuk menggunakan ini maka diperlukan import contactService di module AddressModule lihat bagian import
        private validationService: ValidationService
    ) { }

    async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
        // validate the request
        const createRequest: CreateAddressRequest = this.validationService.validate(AddressValidation.CREATE, request);

        await this.contactService.checkContactExists(user.username, createRequest.contact_id);

        const address = await this.prismaService.address.create({
            data: createRequest
        });

        return this.toAddressResponse(address);
    }

    async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
        this.logger.info("Creating address");

        // validate the request
        const getRequest: GetAddressRequest = this.validationService.validate(AddressValidation.GET, request);
        await this.contactService.checkContactExists(user.username, getRequest.contact_id);

        const address = await this.addressMustExist(getRequest.address_id, getRequest.contact_id);

        return this.toAddressResponse(address);
    }

    toAddressResponse(address: Address): AddressResponse {
        return {
            id: address.id,
            street: address.street,
            city: address.city,
            province: address.province,
            country: address.country,
            postal_code: address.postal_code
        }
    }

    async addressMustExist(addressId: number, contactId: number): Promise<Address> {
        const address = await this.prismaService.address.findFirst({
            where: {
                id: addressId,
                contact_id: contactId
            }
        });

        if (!address) {
            throw new HttpException("Address not found", 404);
        }

        return address;
    }

    async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
        this.logger.info("Updating address");
        // validate the request
        const updateRequest: UpdateAddressRequest = this.validationService.validate(AddressValidation.UPDATE, request);

        await this.contactService.checkContactExists(user.username, updateRequest.contact_id);

        let address = await this.addressMustExist(updateRequest.id, updateRequest.contact_id);

        address = await this.prismaService.address.update({
            where: {
                id: updateRequest.id,
                contact_id: updateRequest.contact_id
            },
            data: updateRequest
        });


        return this.toAddressResponse(address);
    }

    async remove() {
        this.logger.info("Creating address");
    }
}
