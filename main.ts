import express from "express";
import morgan from "morgan";
import dotenv from 'dotenv';
import { OCReturn } from "./types";

dotenv.config();

const app = express();
const port: Number = 3000;

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.get('/api/get/opencore', async (req, res) => {
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

    return res.status(200).json(returnedData);
});

app.listen(port, () => {
    console.log(`Your app is listening on port http://127.0.0.1:${port}`);
});