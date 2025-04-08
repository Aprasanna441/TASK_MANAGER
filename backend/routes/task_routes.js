import express from "express";
import { listTask,addTask,deleteTask } from "../controllers/taskcontroller.js";
import {checkToken} from '../middlewares/check_token.js'
const router=express.Router()

//middleware to check if user is authenticated to  perform add,list or deletion of tasks
router.get('/list',checkToken)
router.post('/add',checkToken)
router.post('/delete',checkToken)


// Public route
router.get('/list',listTask)
router.post('/add',addTask)
router.post('/delete',deleteTask)


export  default router
