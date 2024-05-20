import express, { Request, Response,  } from'express'
import cors from 'cors'
// import { UserRoute } from './app/module/user/user.route';
import notFound from './app/midleware/noteFound';
import router from './app/Routers';
import globalErrorHandler from './app/midleware/globalErrorHandler';
import cookieParser from 'cookie-parser';
import errorPreprocessor from './app/Error/errors/errorPreprocessor';
const app = express()

// parser

app.use(cors({
  origin:  ['https://mutlilangualawalive.vercel.app', 'http://127.0.0.1:5173'],  // Update this to your frontend's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express.json());
app.use(cookieParser());



app.use('/api', router )

app.get('/', (req: Request , res: Response) => {
  res.send('Abulaban E-commerce is running')
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err:any, req: Request, res: Response, ) => {
  // Log the error for server-side debugging
  console.error(err);

  // Process the error using your errorPreprocessor function or similar
  const { statusCode, message, issues } = errorPreprocessor(err);

  res.status(statusCode).json({
      status: 'error',
      message,
      issues,
  });
});
app.use(notFound)
app.use(globalErrorHandler)

export default app

