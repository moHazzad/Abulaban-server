import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.BASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  jwt_access_token: process.env.JWT_ACCESS_SECRET || 'your_jwt_secret',
  jwt_refresh_token: process.env.JWT_REFRESH_SECRET, 
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
};
