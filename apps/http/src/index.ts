import express, { Application, Request, Response } from "express";

// import jwt from 'jsonwebtokenon'

import { prismaClient } from "@repo/db/client";


import {CreateUserSchema} from '@repo/validator/types'

const app: Application = express();

app.post("/signup", (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);


    if (!data.success) {
        res.status(400).json({message:"Invalid Input"});
        return;
    }


    res.json(data.data);

});

app.post("/sigin", (req, res) => {});

app.post("/room", (req, res) => {});

app.listen(8001);
