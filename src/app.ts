import express, { Request, Response } from'express'
import cors from 'cors'
// import { UserRoute } from './app/module/user/user.route';
import notFound from './app/midleware/noteFound';
import router from './app/Routers';
import globalErrorHandler from './app/midleware/globalErrorHandler';
import cookieParser from 'cookie-parser';
const app = express()

// parser
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://127.0.0.1:5173', // or 'http://localhost:5173', based on your front-end URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization'
}));

app.use('/api', router )

app.get('/', (req: Request , res: Response) => {
  res.send('Hotel Awalive is running')
})

app.use(notFound)
app.use(globalErrorHandler)

export default app

