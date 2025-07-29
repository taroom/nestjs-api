export class AddressResponse {
    id: number;
    street?: string;
    city?: string;
    province?: string;
    country: string;
    postal_code: string;
}

export class CreateAddressRequest {
    contact_id: number;// harus ada
    street?: string;
    city?: string;
    province?: string;
    country: string;
    postal_code: string;
}

export class GetAddressRequest {
    contact_id: number;// harus ada
    address_id: number; // harus ada
}

export class UpdateAddressRequest {
    id: number; // harus ada
    contact_id: number;// harus ada
    street?: string;
    city?: string;
    province?: string;
    country: string;
    postal_code: string;
}