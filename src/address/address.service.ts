import { Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "src/common/prisma.service";
import { ValidationService } from "src/common/validation.service";
import { AddressResponse, CreateAddressRequest } from "src/model/address.model";
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

        this.logger.info("Creating address");

        await this.contactService.checkContactExists(user.username, createRequest.contact_id);

        const address = await this.prismaService.address.create({
            data: createRequest
        });

        this.logger.info("Creating address IN DB");

        return {
            id: address.id,
            street: address.street,
            city: address.city,
            province: address.province,
            country: address.country,
            postal_code: address.postal_code
        };
    }

    async get() {
        this.logger.info("Creating address");
    }

    async update() {
        this.logger.info("Creating address");
    }

    async remove() {
        this.logger.info("Creating address");
    }
}
