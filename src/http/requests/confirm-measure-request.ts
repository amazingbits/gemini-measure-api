import { Request } from "express";
import { z } from "zod";

const confirmMeasureSchema = z.object({
  measure_uuid: z
    .string({ message: "the measure_uuid parameter must be a string" })
    .uuid({ message: "the measure_uuid parameter must be a valid uuid" }),
  confirmed_value: z.number({
    message: "the confirmed_value parameter must be a number",
  }),
});

export const validate = (request: Request) => {
  try {
    return confirmMeasureSchema.parse(request.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(JSON.stringify(error.errors));
    }
    throw new Error("Invalid request parameters");
  }
};
