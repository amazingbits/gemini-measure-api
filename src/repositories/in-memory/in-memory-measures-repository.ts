import { v4 as UUID } from "uuid";
import {
  MeasureRepository,
  Measures,
  MeasuresCreateInput,
  MeasureType,
} from "@repositories/measures-repository";

export class InMemoryMeasuresRepository implements MeasureRepository {
  public items: Measures[] = [];

  async findByIdMonthAndMeasureType(
    customer_code: string,
    month: string | number,
    measure_type: MeasureType
  ): Promise<Measures | null> {
    const measure = this.items.find((measure) => {
      const date = measure.measure_datetime
        ? new Date(measure.measure_datetime.toString())
        : new Date();
      return (
        measure.customer_code === customer_code &&
        date.getMonth() + 1 === month &&
        measure.measure_type === measure_type
      );
    });

    if (!measure) {
      return null;
    }

    return measure;
  }

  async findById(customer_code: string): Promise<Measures | null> {
    const measure = this.items.find(
      (measure) => measure.customer_code === customer_code
    );

    if (!measure) {
      return null;
    }

    return measure;
  }

  async create(data: MeasuresCreateInput): Promise<Measures> {
    const measure: MeasuresCreateInput = {
      id: UUID().toString(),
      customer_code: data.customer_code,
      measure_datetime: data.measure_datetime,
      image_url: data.image_url,
      measure_type: data.measure_type,
      measure_value: data.measure_value,
    };

    if (data.customer_code) {
      measure.customer_code = data.customer_code;
    }

    this.items.push(measure as Measures);

    return measure as Measures;
  }
  async updateMeasureValue(
    id: string,
    measure_value: string
  ): Promise<Measures> {
    const measure = this.items.find((measure) => measure.id === id);

    if (measure) {
      measure.measure_value = measure_value;
    }

    const measures = this.items.filter((measure) => measure.id !== id);
    measures.push(measure as Measures);
    this.items = measures;
    return measure as Measures;
  }

  async getAll(): Promise<Measures[]> {
    return this.items;
  }
}
