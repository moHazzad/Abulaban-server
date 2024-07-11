import { Router } from 'express';
// import { CategoryRoute } from '../module/category/category.route';
// import { CourseRoute } from '../module/course/course.route';
// import { UserRoute } from '../module/user/user.route';
// import { authRoutes } from '../module/auth/auth.route';
// import { RoomRoute } from '../module/room/room.route';
// import { bookingRoute } from '../module/booking/booking.route';
// // import { CategoryRoute } from '../module/category/category.route';
// import { RoomReviewRoute } from '../module/review/review.route';
// import { productRoute } from '../module/Products/products.route';
import { UserRoute } from '../module/user/user.route';
import { categoryRoute } from '../module/Category/Category.route';
import { SubCategoryRoute } from '../module/sub-category/subCategory.route';
import { BrandRoute } from '../module/brand/brand.route';
import { productRoute } from '../module/Products/products.route';
import { orderRoute } from '../module/Orders/booking.route';
// import { SubCategoryRoute } from '../module/sub-category/subCategory.route';
// import { MainCategoryRoute } from '../module/Category/Category.route';
// import { BrandRoute } from '../module/brand/brand.route';

// import { UserRoute } from '../module/user/user.route';
// import { orderRoute } from '../module/Orders/booking.route';
// import { categoryRoute } from '../module/Category/Category.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoute,
  },
  {
    path: '/category',
    route: categoryRoute,
  },
  {
    path: '/sub-category',
    route: SubCategoryRoute,
  },
  {
    path: '/brand',
    route: BrandRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  // {
  //   path: '/review',
  //   route: RoomReviewRoute,
  // },
  // {
  //   path: '/course',
  //   route: CourseRoute,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
