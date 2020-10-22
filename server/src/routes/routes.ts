
import { MemeBotttomtextController } from "../controllers/MemeBottomtextController";
import { MemeController } from "../controllers/MemeController";
import { MemeSoundController } from "../controllers/MemeSoundController";
import { MemeToptextController } from "../controllers/MemeToptextController";
import { MemeVisualController } from "../controllers/MemeVisualController";

export const Routes = [{
    method: "get",
    route: "/meme/visuals",
    controller: MemeVisualController,
    action: "all"
}, {
    method: "get",
    route: "/meme/visuals/:id",
    controller: MemeVisualController,
    action: "one"
}, {
    method: "post",
    route: "/meme/visuals",
    controller: MemeVisualController,
    action: "save"
}, {
    method: "delete",
    route: "/meme/visuals/:id",
    controller: MemeVisualController,
    action: "remove"
}, {
    method: "get",
    route: "/meme/sounds",
    controller: MemeSoundController,
    action: "all"
}, {
    method: "get",
    route: "/meme/sounds/:id",
    controller: MemeSoundController,
    action: "one"
}, {
    method: "post",
    route: "/meme/sounds",
    controller: MemeSoundController,
    action: "save"
}, {
    method: "delete",
    route: "/meme/sounds/:id",
    controller: MemeSoundController,
    action: "remove"
}, {
    method: "get",
    route: "/meme/toptexts/:id",
    controller: MemeToptextController,
    action: "one"
}, {
    method: "post",
    route: "/meme/toptexts",
    controller: MemeToptextController,
    action: "save"
},{
    method: "delete",
    route: "/meme/toptexts/:id",
    controller: MemeToptextController,
    action: "remove"
}, {
    method: "get",
    route: "/meme/bottomtexts",
    controller: MemeToptextController,
    action: "all"
}, {
    method: "get",
    route: "/meme/toptexts",
    controller: MemeBotttomtextController,
    action: "all"
}, {
    method: "get",
    route: "/meme/bottomtexts/:id",
    controller: MemeBotttomtextController,
    action: "one"
}, {
    method: "post",
    route: "/meme/bottomtexts",
    controller: MemeBotttomtextController,
    action: "save"
},{
    method: "delete",
    route: "/meme/bottomtexts/:id",
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
    route: "/random/meme",
    controller: MemeController,
    action: "random"
}, {
    method: "get",
    route: "/Memes/random/visual",
    controller: MemeVisualController,
    action: "random"
}, {
    method: "get",
    route: "/Memes/random/sound",
    controller: MemeSoundController,
    action: "random"
}, {
    method: "get",
    route: "/Memes/random/toptext",
    controller: MemeToptextController,
    action: "random"
}, {
    method: "get",
    route: "/Memes/random/bottomtext",
    controller: MemeBotttomtextController,
    action: "random"
}];