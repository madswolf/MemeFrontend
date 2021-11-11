
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
    route: "/visuals",
    controller: MemeVisualController,
    action: "save"
}, {
    method: "delete",
    route: "/visuals/:id",
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
    route: "/sounds",
    controller: MemeSoundController,
    action: "save"
}, {
    method: "delete",
    route: "/sounds/:id",
    controller: MemeSoundController,
    action: "remove"
}, {
    method: "get",
    route: "/toptexts/:id",
    controller: MemeToptextController,
    action: "one"
}, {
    method: "post",
    route: "/toptexts",
    controller: MemeToptextController,
    action: "save"
},{
    method: "delete",
    route: "/toptexts/:id",
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
    route: "/bottomtexts",
    controller: MemeBotttomtextController,
    action: "save"
},{
    method: "delete",
    route: "/bottomtexts/:id",
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
    route: "/upload/memes",
    controller: MemeController,
    action: "save"
}, {
    method: "get",
    route: "/random/meme/:seed?",
    controller: MemeController,
    action: "random"
},
{
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