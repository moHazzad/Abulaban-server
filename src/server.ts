import mongoose from 'mongoose';
import config from './app/config';
import app from './app';

async function server () {
    try {
        await mongoose.connect(config.database_url as string);


        app.listen(config.port, () => {
          console.log(`App listening on port ${config.port}`);
        });
      } catch (error) {
        console.log(error, "its not error");
      }

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
server()

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
//   })