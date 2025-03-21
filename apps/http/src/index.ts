import express, { Application, Request, Response } from "express";

// import jwt from 'jsonwebtokenon'

import { prismaClient } from "@repo/db/client";

import { CreateUserSchema } from "@repo/common/types";

const app: Application = express();

app.post("/signup", (req, res) => {});

app.post("/sigin", (req, res) => {});

app.post("/room", (req, res) => {});

app.listen(8001);
