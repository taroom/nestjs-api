import { Module } from "@nestjs/common";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { ContactModule } from "src/contact/contact.module";

@Module({
    controllers: [AddressController],
    providers: [AddressService],
    imports: [ContactModule],// ContactModule ini diperlukan untuk menginject ContactService ke dalam AddressService, nah ini juga butuh ContactModule untuk mengexport ContactService, lihat ContactModule
    exports: []
})
export class AddressModule { }