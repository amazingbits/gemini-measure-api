import { Request, Response } from "express";
import { MeasureRepository } from "@repositories/measures-repository";
import { validate as validateCreateMeasureParams } from "@requests/confirm-measure-request";
import InvalidDataError from "@/http/errors/invalid-data-error";
import NotFoundError from "@/http/errors/not-found-error";

export class ConfirmMeasureService {
  constructor(private measuresRepository: MeasureRepository) {}

  async handle(request: Request, response: Response) {
    // validate request params
    let requestParams = null;
    try {
      requestParams = validateCreateMeasureParams(request);
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidDataError({
          message: "INVALID_DATA",
          context: { errors: JSON.parse(error.message) },
        });
      }
    }

    // verify if  measure exists
    let measure = null;
    try {
      measure = await this.measuresRepository.findById(
        requestParams?.measure_uuid!
      );
      if (!measure) {
        throw new NotFoundError({ message: "measure not found" });
      }
    } catch (error) {
      throw new NotFoundError({ message: "measure not found" });
    }

    // update measure value
    try {
      measure = await this.measuresRepository.updateMeasureValue(
        measure.id,
        requestParams?.confirmed_value.toString()!
      );
    } catch (error) {
      throw error;
    }

    // return updated measure
    response.json({
      success: true,
      measure,
    });
  }
}
