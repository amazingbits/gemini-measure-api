import { Request, Response } from "express";
import { CreateMeasureService } from "@services/create-measure-service";
import { PrismaMeasuresRepository } from "@repositories/prisma/prisma-measures-repository";

export const upload = async (request: Request, response: Response) => {
  try {
    const createMeasureService = new CreateMeasureService(
      new PrismaMeasuresRepository()
    );
    const res = await createMeasureService.handle(request, response);
    return response.json(res);
  } catch (error) {
    throw error;
  }
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
