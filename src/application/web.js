/** @format */

import express from "express";
import {errorMiddleware} from "../middleware/error-middleware.js";
import {publicRouter} from "../route/public-api.js";
import {userRouter} from "../route/user-api.js";


export const app = express();

app.use(express.json());

app.use(publicRouter);
app.use(userRouter);

app.use(errorMiddleware);