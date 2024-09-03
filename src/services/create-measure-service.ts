import { Request, Response } from "express";
import { v4 as UUID } from "uuid";
import { MeasureRepository, Measures } from "@repositories/measures-repository";
import { validate as validateCreateMeasureParams } from "@requests/create-measure-request";
import { generateReadingFromLLM } from "@libs/google";
import { MeasureLLMResponseResource } from "@resources/measure-llm-response-resource";
import { convertFromBase64ToJPG } from "@helpers/convert-from-base64-to-jpg";
import DoubleReportError from "@/http/errors/double-report-error";
import InvalidDataError from "@/http/errors/invalid-data-error";

export class CreateMeasureService {
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

    // get response from LLM
    let responseFromLLM = null;
    try {
      responseFromLLM = await generateReadingFromLLM(
        requestParams!.image,
        requestParams!.measure_type
      );
    } catch (error) {
      if (error instanceof Error) {
        return response.status(500).json({ errors: error.message });
      }
      throw new InvalidDataError({
        message: "Error generating reading from LLM",
      });
    }

    // validate response received from LLM
    if (!responseFromLLM) {
      throw new InvalidDataError({
        message: "No valid reading found from image received",
      });
    }

    let llmMeasure: MeasureLLMResponseResource | null = null;
    if (Array.isArray(responseFromLLM)) {
      if (responseFromLLM.length > 0) {
        llmMeasure = responseFromLLM[0];
      }
    } else {
      llmMeasure = responseFromLLM;
    }

    if (!llmMeasure?.is_valid) {
      throw new InvalidDataError({
        message: "Image must be a gas or water reader",
      });
    }

    if (llmMeasure?.reading === null) {
      throw new InvalidDataError({
        message: "No reading found from image received",
      });
    }

    // generating JPG from base64 encoded string passed from request params
    const imageName = UUID().toString();
    let outputPath = "";
    try {
      outputPath = convertFromBase64ToJPG(
        requestParams?.image!,
        `${imageName}.jpg`
      );
    } catch (error) {
      if (error instanceof Error) {
        return response.status(400).json({ error: error.message });
      }
    }

    // persist data in database
    const date = requestParams?.measure_datetime ?? new Date();
    const measureAlreadyMade =
      await this.measuresRepository.findByIdMonthAndMeasureType(
        requestParams?.customer_code!,
        date,
        requestParams?.measure_type!
      );
    if (measureAlreadyMade) {
      throw new DoubleReportError({
        message: "Measure already made for this month and type",
        context: { measure_type: requestParams?.measure_type },
      });
    }

    const measure = await this.measuresRepository.create({
      customer_code: requestParams?.customer_code!,
      measure_datetime: date,
      image_url: outputPath,
      measure_type: requestParams?.measure_type!,
      measure_value: llmMeasure?.reading.toString(),
    });

    return {
      image_url: outputPath,
      measure_value: measure.measure_value,
      measure_uuid: measure.id,
    };
  }
}
