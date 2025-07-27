import z, { ZodType } from "zod";

export class ContactValidation {
    static readonly CREATE: ZodType = z.object({
        first_name: z.string().min(1).max(100),
        last_name: z.string().min(1).max(100).optional(),
        email: z.string().min(5).max(100).email().optional(),
        phone: z.string().min(1).max(20).optional()
    });

    static readonly UPDATE: ZodType = z.object({
        id: z.number().int().positive(),
        first_name: z.string().min(1).max(100),
        last_name: z.string().min(1).max(100).optional(),
        email: z.string().min(5).max(100).email().optional(),
        phone: z.string().min(1).max(20).optional()
    });

    static readonly SEARCH: ZodType = z.object({
        name: z.string().min(1).optional(),
        email: z.string().min(5).optional(),
        phone: z.string().min(1).optional(),
        page: z.number().int().min(1).positive().optional(),
        size: z.number().int().min(1).positive().optional()
    });
}