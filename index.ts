import express from "express";
import { Octokit } from "octokit";

const app = express();
const port: Number = 3000;

const api_token: String = "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";

const octokit = new Octokit({
    auth: api_token
});

type OCDlUrls = {
    debug: String
    release: String
}

type OCReturn = {
    name: String
    version: String
    dl_url: OCDlUrls
    date: String
    content: String
}

app.get('/api/get/opencore/:version', async (req, res) => {
    return res.json(req.params);

    // const data = await octokit.request("GET /repos/acidanthera/OpenCorePkg/releases/latest");

    // if (!data) {
    //     return res.status(404).json("Something went wrong...");
    // }

    // const returnedData: OCReturn = {
    //     name: `OpenCorePkg v${data.data.name}`,
    //     version: data.data.name,
    //     dl_url: {
    //         debug: data.data.assets[0].browser_download_url,
    //         release: data.data.assets[1].browser_download_url,
    //     },
    //     date: data.data.published_at,
    //     content: data.data.body
    // }

    // return res.status(200).json(returnedData);
});

app.listen(port, () => {
    console.log(`Your app is listening on port http://127.0.0.1:${port}`);
});