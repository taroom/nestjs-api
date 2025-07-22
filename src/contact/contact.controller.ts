import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { User } from "@prisma/client";
import { ContactResponse, CreateContactRequest } from "src/model/contact.model";
import { request } from "http";
import { Auth } from "src/common/auth.decorator";
import { WebResponse } from "src/model/web.model";

@Controller('/api/contacts')
export class ContactController {
    // memasukkan depedency lewat constructor
    constructor(private contactService: ContactService) { }

    @Post()
    @HttpCode(200)
    async create(
        @Auth() user: User,
        @Body() request: CreateContactRequest
    ): Promise<WebResponse<ContactResponse>> {
        const result = await this.contactService.create(user, request);
        return {
            data: result
        };
    }
}