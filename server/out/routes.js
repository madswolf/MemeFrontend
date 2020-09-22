"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserController_1 = require("./controller/UserController");
exports.Routes = [{
        method: "get",
        route: "/users",
        controller: UserController_1.UserController,
        action: "all"
    }, {
        method: "get",
        route: "/users/:id",
        controller: UserController_1.UserController,
        action: "one"
    }, {
        method: "post",
        route: "/users",
        controller: UserController_1.UserController,
        action: "save"
    }, {
        method: "delete",
        route: "/users/:id",
        controller: UserController_1.UserController,
        action: "remove"
    }];
//# sourceMappingURL=routes.js.map