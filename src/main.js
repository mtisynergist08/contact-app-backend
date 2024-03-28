/** @format */


import {app} from "./application/web.js";
import {logger} from "./application/logging.js";

const PORT = 3000;

app.listen(PORT, () => {
    logger.info("App start");
});
