import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv';
import fs from "fs";
import { OCReturn } from "./types";
import path from "path";

dotenv.config();

const app = express();
const port: Number = 3000;

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.get("/api/update/parts", async (req, res) => {
    const data = await fetch("https://api.github.com/repos/docyx/pc-part-dataset/contents/data/json/cpu.json")
    const dataJSON = await data.json();
    
    if (!data) {
        return res.status(404).json("Something went wrong...");    
    }
    
    const content = dataJSON.content;
    const contentDecoded = atob(content);
    const contentDecodedJSON = JSON.parse(contentDecoded);
    
    if (!contentDecoded) {
        return res.status(404).json("Something went wrong...");    
    }

    return res.status(200).json(contentDecodedJSON);

});

app.get('/api/update/opencore', async (req, res) => {
    const data = await fetch("https://api.github.com/repos/acidanthera/OpenCorePkg/releases/latest");
    const dataJSON = await data.json();

    if (!data) {
        return res.status(404).json("Something went wrong...");
    }

    const returnedData: OCReturn = {
        name: `OpenCorePkg v${dataJSON.name}`,
        version: dataJSON.name,
        dl_url: {
            debug: dataJSON.assets[0].browser_download_url,
            release: dataJSON.assets[1].browser_download_url,
        },
        date: dataJSON.published_at,
        content: dataJSON.body
    }

    fs.writeFileSync(
        path.join(path.resolve(), "/storage/opencore.json"), 
        JSON.stringify(returnedData), 
        { 
            encoding: "utf8"
        }
    );

    return res.status(200).json(returnedData);
});

app.listen(port, () => {
    console.log(`Your app is listening on port http://127.0.0.1:${port}`);
});