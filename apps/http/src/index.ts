import express, { Application, Request, Response } from "express";

// import jwt from 'jsonwebtokenon'
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/client";


import {CreateUserSchema} from '@repo/validator/types'

const app: Application = express();


app.use(express.json());

app.post("/signup", async (req, res) => {
    const data = CreateUserSchema.safeParse(req.body);

   


    if (!data.success) {
        res.status(400).json({message:"Invalid Input"});
        return;
    }

try {
  const hashedPassword = await bcrypt.hash(data.data.password, 10);

  const user = await prismaClient.user.create({
    data: {
      email: data.data.email,
      password: hashedPassword,
      name: data.data.name,
    },
  });

  res.json({
    message: "User registered successfully",
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    }, // Do not return the password
  });
} catch (error) {
  res
    .status(500)
    .json({ message: "Internal Server Error", error: error });
}

});

app.post("/sigin", (req, res) => {});

app.post("/room", (req, res) => {});

app.listen(8001);
