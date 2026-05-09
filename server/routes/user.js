import express from 'express'
import { getUsers, getUser, getEmployeeClients, filterUser, createClient, createEmployee, updateRole, deleteUser, getClients, getEmployees, deleteWholeCollection, checkEmail, checkUsername } from '../controllers/user.js'
import { verifyManager, verifyEmployee, verifyToken, verifySuperAdmin, verifyIsSameUser } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { createClientSchema, createEmployeeSchema } from '../utils/schemas.js'
import { createError } from '../utils/error.js'

const router = express.Router()


// GET
router.get('/check-email', verifyToken, checkEmail)
router.get('/check-username', verifyToken, checkUsername)
router.get('/get/all', verifyToken, verifyManager, getUsers)
router.get('/get/single/:userId', verifyToken, verifyIsSameUser, getUser)
router.get('/get/clients', verifyToken, verifyEmployee, getClients)
router.get('/get/clients/employee', verifyToken, verifyEmployee, getEmployeeClients)
router.get('/get/employees', verifyToken, verifyEmployee, getEmployees)
router.get('/filter', verifyToken, verifyEmployee, filterUser)

// POST 
router.post('/create/client', verifyToken, verifyEmployee, validate(createClientSchema), createClient)
router.post('/create/employee', verifyToken, verifyManager, validate(createEmployeeSchema), createEmployee)

// PUT
router.put('/update-role/:userId', verifyToken, verifyManager, updateRole)

// DELETE
router.delete('/delete/:userId', verifyToken, verifySuperAdmin, deleteUser)
router.delete('/delete-whole-collection', deleteWholeCollection)

export default router