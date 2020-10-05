
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
}, {
    method: "get",
    route: "/memevisuals",
    controller: MemeController,
    action: "allVisuals"
}, {
    method: "get",
    route: "/memesounds",
    controller: MemeController,
    action: "allSounds"
}, {
    method: "get",
    route: "/memetoptexts",
    controller: MemeController,
    action: "allToptexts"
}, {
    method: "get",
    route: "/memebottomtexts",
    controller: MemeController,
    action: "allBottomtexts"
},  {
    method: "post",
    route: "/memes",
    controller: MemeController,
    action: "save"
}];