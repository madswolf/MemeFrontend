import { UploadedFile } from "express-fileupload";
import * as compress_images from 'compress-images';
import * as fs from 'fs';


export function getFromTableRandom(table:Object[]) {
    return table[Math.floor(Math.random() * table.length)];
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

export function compressImage(srcPath:string,outPath:string,fileName:string){
    if(fs.existsSync(outPath + fileName)){
        const id = makeid(5);
        fs.renameSync(srcPath + fileName, srcPath + id + fileName);
        fileName = id + fileName;
    }

    //optimize     
    compress_images(srcPath + fileName,outPath, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "giflossy", command: ['--lossy=80'] } },
        function (error, completed, statistic) {
            //delete temp file and log result
            fs.unlinkSync(srcPath + fileName);
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");
        }
        
    );
    
    return fileName;


    
    
}