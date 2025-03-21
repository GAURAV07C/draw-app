import express, { Application, Request, Response } from "express";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prismaClient } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/config";

import {
  createRoomSchema,
  CreateUserSchema,
  SignInSchmea,
} from "@repo/validator/types";
import { authMiddleware } from "./middleware";

const app: Application = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);

  if (!data.success) {
    res.status(400).json({ message: "Invalid Input" });
    return;
  }

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.data.email,
      },
    });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

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
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

app.post("/signin", async (req, res) => {
  const data = SignInSchmea.safeParse(req.body);

  if (!data.success) {
    res.status(400).json({ message: "Invalid Input" });
    return;
  }

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: data.data.email,
      },
    });

    if (!existingUser) {
      res.status(400).json({ message: "User not register" });
      return;
    }

    const isMatch = await bcrypt.compare(
      data.data.password,
      existingUser.password
    );

    if (!isMatch) {
      res.status(400).json({ message: "Invalid password" });

      return;
    }

    // Generate JWT token (optional)
    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      user: {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
      },
      token,
    });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/room", authMiddleware, async (req: Request, res: Response) => {
  const data = createRoomSchema.safeParse(req.body);

  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const room = await prismaClient.room.create({
      data: {
        slug: data.data?.name || "default-slug",
        adminId: userId,
      },
    });

    res.json({
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

app.listen(8001);
