import { Request, Response } from "express";
import {
  MeasureRepository,
  Measures,
  FindMeasureByCustomerIdProps,
  MeasureType,
} from "@/repositories/measures-repository";
import InvalidDataError from "@/http/errors/invalid-data-error";
import NotFoundError from "@/http/errors/not-found-error";

export class ListMeasureService {
  constructor(private measuresRepository: MeasureRepository) {}

  async handle(request: Request, response: Response) {
    const { customer_code } = request.params;
    const { measure_type } = request.query;

    if (measure_type) {
      if (
        measure_type.toString().toLowerCase() !== "water" &&
        measure_type.toString().toLowerCase() !== "gas"
      ) {
        throw new InvalidDataError({
          message: "Invalid measure_type. It must be 'water' or 'gas'",
        });
      }
    }

    let measures: Measures[] = [];
    let params: FindMeasureByCustomerIdProps = {
      customer_code,
      measure_type: !measure_type ? undefined : (measure_type as MeasureType),
    };
    try {
      measures = await this.measuresRepository.findByCustomerId(params);
      return measures;
    } catch (error) {
      throw new NotFoundError({ message: "measure not found" });
    }
  }
}
