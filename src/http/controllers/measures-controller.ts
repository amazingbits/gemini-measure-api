import { Request, Response } from "express";
import { CreateMeasureService } from "@services/create-measure-service";
import { ConfirmMeasureService } from "@services/confirm-measure-service";
import { ListMeasureService } from "@services/list-measures-service";
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
  try {
    const confirmMeasureService = new ConfirmMeasureService(
      new PrismaMeasuresRepository()
    );
    const res = await confirmMeasureService.handle(request, response);
    return response.json(res);
  } catch (error) {
    throw error;
  }
};

export const list = async (request: Request, response: Response) => {
  try {
    const listMeasureService = new ListMeasureService(
      new PrismaMeasuresRepository()
    );
    const res = await listMeasureService.handle(request, response);
    return response.json(res);
  } catch (error) {
    throw error;
  }
};
