"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { CategoryRoute } from '../module/category/category.route';
// import { CourseRoute } from '../module/course/course.route';
const user_route_1 = require("../module/user/user.route");
const auth_route_1 = require("../module/auth/auth.route");
const room_route_1 = require("../module/room/room.route");
const booking_route_1 = require("../module/booking/booking.route");
const category_route_1 = require("../module/category/category.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.authRoutes,
    },
    {
        path: '/user',
        route: user_route_1.UserRoute,
    },
    {
        path: '/room',
        route: room_route_1.RoomRoute,
    },
    {
        path: '/category',
        route: category_route_1.CategoryRoute,
    },
    {
        path: '/booking',
        route: booking_route_1.bookingRoute,
    },
    // {
    //   path: '/course',
    //   route: CourseRoute,
    // },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
