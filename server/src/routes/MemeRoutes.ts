
import { MemeBotttomtextController } from "../controllers/MemeBottomtextController";
import { MemeController } from "../controllers/MemeController";
import { MemeSoundController } from "../controllers/MemeSoundController";
import { MemeToptextController } from "../controllers/MemeToptextController";
import { MemeVisualController } from "../controllers/MemeVisualController";

export const Routes = [{
    method: "get",
    route: "/visuals",
    controller: MemeVisualController,
    action: "all"
}, {
    method: "get",
    route: "/visuals/:id",
    controller: MemeVisualController,
    action: "one"
}, {
    method: "post",
    route: "/:topic?/visuals",
    controller: MemeVisualController,
    action: "save"
}, {
    method: "delete",
    route: "/:topic?/visuals/:id",
    controller: MemeVisualController,
    action: "remove"
}, {
    method: "get",
    route: "/sounds",
    controller: MemeSoundController,
    action: "all"
}, {
    method: "get",
    route: "/sounds/:id",
    controller: MemeSoundController,
    action: "one"
}, {
    method: "post",
    route: "/:topic?/sounds",
    controller: MemeSoundController,
    action: "save"
}, {
    method: "delete",
    route: "/:topic?/sounds/:id",
    controller: MemeSoundController,
    action: "remove"
}, {
    method: "get",
    route: "/toptexts/:id",
    controller: MemeToptextController,
    action: "one"
}, {
    method: "post",
    route: "/:topic?/toptexts",
    controller: MemeToptextController,
    action: "save"
},{
    method: "delete",
    route: "/:topic?/toptexts/:id",
    controller: MemeToptextController,
    action: "remove"
}, {
    method: "get",
    route: "/bottomtexts",
    controller: MemeBotttomtextController,
    action: "all"
}, {
    method: "get",
    route: "/toptexts",
    controller: MemeToptextController,
    action: "all"
}, {
    method: "get",
    route: "/bottomtexts/:id",
    controller: MemeBotttomtextController,
    action: "one"
}, {
    method: "post",
    route: "/:topic?/bottomtexts",
    controller: MemeBotttomtextController,
    action: "save"
},{
    method: "delete",
    route: "/:topic?/bottomtexts/:id",
    controller: MemeBotttomtextController,
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
    method: "post",
    route: "/:topic?/upload/memes",
    controller: MemeController,
    action: "save"
}, {
    method: "get",
    route: "/:topic?/random/meme",
    controller: MemeController,
    action: "random"
}, {
    method: "get",
    route: "/:topic?/random/visual",
    controller: MemeVisualController,
    action: "random"
}, {
    method: "get",
    route: "/:topic?/random/sound",
    controller: MemeSoundController,
    action: "random"
}, {
    method: "get",
    route: "/:topic?/random/toptext",
    controller: MemeToptextController,
    action: "random"
}, {
    method: "get",
    route: "/:topic?/random/bottomtext",
    controller: MemeBotttomtextController,
    action: "random"
}];