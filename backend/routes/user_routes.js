import express from "express";
import { userLogin,userSignup } from "../controllers/userController.js";

const router=express.Router()




// Public route
router.post('/signup',userSignup)
router.post('/login',userLogin)


export  default router
