import { UploadedFile } from "express-fileupload";
import * as compress_images from 'compress-images';



export function getFromTableRandom(table:Object[]) {
    return table[Math.floor(Math.random() * table.length)];
}

export function saveAndCompress(path:string,file:UploadedFile){
    file.mv(path + '/temp/' + file.name);
    
    //optimize     
    compress_images(path + '/temp/' + file.name,path, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        function (error, completed, statistic) {
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");
        }
    );
}