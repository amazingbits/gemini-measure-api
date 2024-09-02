import { Request, Response } from "express";

export const upload = async (request: Request, response: Response) => {
  return response.json({
    message: "Upload measure route",
    action: "add new measure",
  });
};

export const confirm = async (request: Request, response: Response) => {
  return response.json({
    message: "Confirm measure route",
    action: "upload measure information",
  });
};

export const list = async (request: Request, response: Response) => {
  return response.json({
    message: "List measures route",
    action: "get all measures from a customer",
  });
};
