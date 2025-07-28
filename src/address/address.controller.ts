import { Body, Controller, HttpCode, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { AddressService } from "./address.service";
import { get } from "http";
import { AddressResponse, CreateAddressRequest } from "src/model/address.model";
import { User } from "@prisma/client";
import { Auth } from "src/common/auth.decorator";
import { WebResponse } from "src/model/web.model";

@Controller('api/contacts/:contactId/addresses')
export class AddressController {
    // add required service on constructor
    constructor(private addressService: AddressService) { }

    @Post()
    @HttpCode(200)
    async create(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number, // assuming contactId is passed as a route parameter
        @Body() request: CreateAddressRequest
    ): Promise<WebResponse<AddressResponse>> {
        // implement create address logic
        // set contact_id from the route parameter
        request.contact_id = contactId;

        const result = await this.addressService.create(user, request);
        return {
            data: result
        };
    }

    /* @Put(':addressId')
    async update() {
        // implement update address logic
    }

    @get(':addressId')
    get() {
        // implement get address logic
    } */
}