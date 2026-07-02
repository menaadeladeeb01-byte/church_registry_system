import { z } from 'zod';

const nameRegex = /^[a-zA-Z\s]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const registerSchema = z.object({
    body: z.object({

        name: z.string({ required_error: "Name is required" })
            .min(3, "Name must be at least 3 characters long")
            .max(50, "Name must not exceed 50 characters")
            .regex(nameRegex, "Name must contain only letters and spaces"),

        email: z.string({ required_error: "Email is required" })
            .email("Invalid email format"),

        password: z.string({ required_error: "Password is required" })
            .min(6, "Password must be at least 6 characters")
            .regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),

        church_id: z.number({ required_error: "Church ID is required" })
            .int()
            .positive()    
        
    })
});

