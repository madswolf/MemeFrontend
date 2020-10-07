
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
    route: "/upload/memes",
    controller: MemeController,
    action: "save"
}, {
    method: "get",
    route: "/random/meme",
    controller: MemeController,
    action: "random"
}, {
    method: "get",
    route: "/random/visual",
    controller: MemeVisualController,
    action: "random"
}, {
    method: "get",
    route: "/random/sound",
    controller: MemeSoundController,
    action: "random"
}, {
    method: "get",
    route: "/random/toptext",
    controller: MemeToptextController,
    action: "random"
}, {
    method: "get",
    route: "/random/bottomtext",
    controller: MemeBotttomtextController,
    action: "random"
}];