import { MeasureRepository, Measures } from "@repositories/measures-repository";
import DoubleReportError from "@/http/errors/double-report-error";

export class CreateMeasureService {
  constructor(private measuresRepository: MeasureRepository) {}

  async handle(params: Measures) {
    const date = params.measure_datetime ?? new Date();
    const measureAlreadyMade =
      await this.measuresRepository.findByIdMonthAndMeasureType(
        params.customer_code,
        date,
        params.measure_type
      );
    if (measureAlreadyMade) {
      throw new DoubleReportError({
        message: "Measure already made for this month and type",
        logging: true,
        context: { measure_type: params.measure_type },
      });
    }
    const measure = await this.measuresRepository.create(params);
    return measure;
  }
}
