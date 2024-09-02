export type MeasureType = "WATER" | "GAS";

export type Measures = {
  id: string;
  customer_code: string;
  measure_datetime?: String | Date | undefined;
  image_url: string;
  measure_type: MeasureType;
  measure_value: string;
};

export type MeasuresCreateInput = {
  id?: string | undefined;
  customer_code: string;
  measure_datetime?: String | Date | undefined;
  image_url: string;
  measure_type: MeasureType;
  measure_value: string;
};

export interface MeasureRepository {
  findByIdMonthAndMeasureType(
    customer_code: string,
    month: string | number,
    measure_type: MeasureType
  ): Promise<Measures | null>;
  findById(customer_code: string): Promise<Measures | null>;
  create(data: MeasuresCreateInput): Promise<Measures>;
  updateMeasureValue(id: string, measure_value: string): Promise<Measures>;
  getAll(): Promise<Measures[]>;
}
