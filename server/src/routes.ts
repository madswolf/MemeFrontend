import { MemeBotttomtextController } from "./controller/MemeBottomtextController";
import { MemeController } from "./controller/MemeController";
import { MemeSoundController } from "./controller/MemeSoundController";
import { MemeToptextController } from "./controller/MemeToptextController";
import { MemeVisualController } from "./controller/MemeVisualController";
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
    controller: MemeVisualController,
    action: "all"
}, {
    method: "get",
    route: "/memesounds",
    controller: MemeSoundController,
    action: "all"
}, {
    method: "get",
    route: "/memetoptexts",
    controller: MemeToptextController,
    action: "all"
}, {
    method: "get",
    route: "/memebottomtexts",
    controller: MemeBotttomtextController,
    action: "all"
}, {
    method: "get",
    route: "/random/memebottomtexts",
    controller: MemeBotttomtextController,
    action: "random"
},  {
    method: "post",
    route: "/memes",
    controller: MemeController,
    action: "save"
}];