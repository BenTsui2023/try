import { Router } from 'express'; 
import userRouter from './users.js';
import orderedMealsRouter from './orderedMeals.js'; 

const router = Router(); 
router.use('/users', userRouter);
router.use('/orderedMeals', orderedMealsRouter); 
export default router; 