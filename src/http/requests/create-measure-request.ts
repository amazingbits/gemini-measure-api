import { Request } from "express";
import { z } from "zod";

const createMeasureSchema = z.object({
  image: z
    .string({ message: "the image parameter must be a string" })
    .base64({ message: "the image parameter must be a base64 encoded string" }),
  customer_code: z
    .string({ message: "the customer_code parameter must be a string" })
    .uuid({ message: "the customer_code parameter must be a valid uuid" }),
  measure_datetime: z
    .string({ message: "the measure_datetime parameter must be a string" })
    .datetime({
      message:
        "the measure_datetime parameter must be a datetime format string",
    }),
  measure_type: z.enum(["WATER", "GAS"], {
    message: "the measure_type parameter must be 'WATER' or 'GAS'",
  }),
});

export const validate = (request: Request) => {
  try {
    return createMeasureSchema.parse(request.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(error.errors));
    }
    throw new Error("Invalid request parameters");
  }
};
