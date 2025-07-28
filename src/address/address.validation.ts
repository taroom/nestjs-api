import z, { ZodType } from "zod";

export class AddressValidation {
    static readonly CREATE: ZodType = z.object({
        contact_id: z.number().int().positive().min(1, "Contact ID must be a positive integer"),
        street: z.string().min(1).max(255).optional(),
        city: z.string().min(1).max(100).optional(),
        province: z.string().min(1).max(100).optional(),
        country: z.string().min(1).max(100),
        postal_code: z.string().min(1).max(10)
    });

    static readonly UPDATE: ZodType = z.object({
        street: z.string().min(1).max(255).optional(),
        city: z.string().min(1).max(100).optional(),
        province: z.string().min(1).max(100).optional(),
        country: z.string().min(1).max(100).optional(),
        postal_code: z.string().min(1).max(10).optional()
    });
}