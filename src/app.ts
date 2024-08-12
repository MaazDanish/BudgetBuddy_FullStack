import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config()

import sequelize from './utils/database';
import userRoutes from './routes/userRoutes'
import forgotPasswordRoutes from './routes/forgotPasswordRoutes'
import expenseRoutes from './routes/expenseRoutes'
import setUpAssociations from './models/associations';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/bb/user', userRoutes);
app.use('/bb/user/help', forgotPasswordRoutes);
app.use('/bb/expense', expenseRoutes);

app.use('*', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.status(404).send({ msg: "Page Not Found", do: "Try with right path", success: false })
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "internal server error", success: false })
    }
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send({ msg: 'Internal Server Error', success: false });
});

// Associations Calling
setUpAssociations();

sequelize.sync().then(() => {
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`Server is running on http://127.0.0.1:${process.env.SERVER_PORT}/`);
    })
})
    .catch(err => {
        console.log(err);
    })