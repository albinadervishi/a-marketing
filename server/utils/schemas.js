import { z } from 'zod'

const userFields = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName:  z.string().min(1, 'Last name is required'),
    username:  z.string().min(3, 'Username must be at least 3 characters'),
    email:     z.string().email('Invalid email address'),
    phone:     z.string().min(7, 'Phone number is required'),
    city:      z.string().optional(),
    CNIC:      z.string().optional(),
})

export const createClientSchema = userFields

export const createEmployeeSchema = userFields.extend({
    email:    z.string().email('Invalid email').optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const updateUserSchema = userFields.partial().extend({
    email: z.string().email('Invalid email').optional().or(z.literal('')),
})
