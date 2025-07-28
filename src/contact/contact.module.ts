import { Module } from "@nestjs/common";
import { ContactService } from "./contact.service";
import { ContactController } from "./contact.controller";

@Module({
    providers: [ContactService],
    controllers: [ContactController],
    exports: [ContactService], // Export ContactService so it can be used in other modules
})
export class ContactModule { }