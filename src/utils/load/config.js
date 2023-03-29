import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync("./config.json"));
export { data as Config };