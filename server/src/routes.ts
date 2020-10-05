
import { MemeController } from "./controller/MemeController";
import {UserController} from "./controller/UserController";

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}, {
    method: "get",
    route: "/memes",
    controller: MemeController,
    action: "all"
},{
    method: "get",
    route: "/memes/:id",
    controller: MemeController,
    action: "one"
}, {
    method: "delete",
    route: "/memes/:id",
    controller: MemeController,
    action: "remove"
}, {
    method: "post",
    route: "/memes",
    controller: MemeController,
    action: "save"
}, {
    method: "get",
    route: "/randommeme",
    controller: MemeController,
    action: "random"
}];