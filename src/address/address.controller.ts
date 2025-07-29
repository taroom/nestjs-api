import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { AddressService } from "./address.service";
import { get } from "http";
import { AddressResponse, CreateAddressRequest, GetAddressRequest, UpdateAddressRequest } from "src/model/address.model";
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



    @Get('/:addressId')
    @HttpCode(200)
    async get(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
    ): Promise<WebResponse<AddressResponse>> {
        // implement get address logic

        const request: GetAddressRequest = {
            contact_id: contactId,
            address_id: addressId
        }

        const result = await this.addressService.get(user, request);

        return {
            data: result
        };
    }

    @Put('/:addressId')
    @HttpCode(200)
    async update(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number, // assuming contactId is passed as a route parameter
        @Param('addressId', ParseIntPipe) addressId: number, // assuming contactId is passed as a route parameter
        @Body() request: UpdateAddressRequest
    ): Promise<WebResponse<AddressResponse>> {
        // implement create address logic
        // set contact_id from the route parameter
        request.contact_id = contactId;
        request.id = addressId; // set id from the route parameter

        const result = await this.addressService.update(user, request);
        return {
            data: result
        };
    }

    @Delete('/:addressId')
    @HttpCode(200)
    async remove(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number,
        @Param('addressId', ParseIntPipe) addressId: number,
    ): Promise<WebResponse<boolean>> {
        // implement get address logic

        const request: GetAddressRequest = {
            contact_id: contactId,
            address_id: addressId
        }

        const result = await this.addressService.remove(user, request);

        return {
            data: true
        };
    }

    @Get()
    @HttpCode(200)
    async list(
        @Auth() user: User,
        @Param('contactId', ParseIntPipe) contactId: number
    ): Promise<WebResponse<AddressResponse[]>> {
        // implement get address logic

        const result = await this.addressService.list(user, contactId);

        return {
            data: result
        };
    }
}