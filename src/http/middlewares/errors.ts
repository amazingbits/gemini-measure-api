import { Request, Response, NextFunction } from "express";
import { CustomError } from "@/http/errors/custom-error";

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof CustomError) {
    const { statusCode, errors, logging } = error;
    if (logging) {
      console.error(
        JSON.stringify(
          {
            code: error.statusCode,
            errors: error.errors,
            stack: error.stack,
          },
          null,
          2
        )
      );
    }

    return response.status(statusCode).send({ errors });
  }

  console.error(JSON.stringify(error, null, 2));
  return response
    .status(500)
    .send({ errors: [{ message: "Something went wrong" }] });
};
