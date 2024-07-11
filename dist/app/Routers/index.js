"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { CategoryRoute } from '../module/category/category.route';
// import { CourseRoute } from '../module/course/course.route';
// import { UserRoute } from '../module/user/user.route';
// import { authRoutes } from '../module/auth/auth.route';
// import { RoomRoute } from '../module/room/room.route';
// import { bookingRoute } from '../module/booking/booking.route';
// // import { CategoryRoute } from '../module/category/category.route';
// import { RoomReviewRoute } from '../module/review/review.route';
// import { productRoute } from '../module/Products/products.route';
const user_route_1 = require("../module/user/user.route");
const Category_route_1 = require("../module/Category/Category.route");
const subCategory_route_1 = require("../module/sub-category/subCategory.route");
const brand_route_1 = require("../module/brand/brand.route");
const products_route_1 = require("../module/Products/products.route");
const booking_route_1 = require("../module/Orders/booking.route");
// import { SubCategoryRoute } from '../module/sub-category/subCategory.route';
// import { MainCategoryRoute } from '../module/Category/Category.route';
// import { BrandRoute } from '../module/brand/brand.route';
// import { UserRoute } from '../module/user/user.route';
// import { orderRoute } from '../module/Orders/booking.route';
// import { categoryRoute } from '../module/Category/Category.route';
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.UserRoute,
    },
    {
        path: '/category',
        route: Category_route_1.categoryRoute,
    },
    {
        path: '/sub-category',
        route: subCategory_route_1.SubCategoryRoute,
    },
    {
        path: '/brand',
        route: brand_route_1.BrandRoute,
    },
    {
        path: '/products',
        route: products_route_1.productRoute,
    },
    {
        path: '/orders',
        route: booking_route_1.orderRoute,
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
exports.default = router;
