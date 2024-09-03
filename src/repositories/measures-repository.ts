export type MeasureType = "WATER" | "GAS";

export type Measures = {
  id: string;
  customer_code: String;
  measure_datetime?: String | Date | undefined;
  image_url: String;
  measure_type: MeasureType;
  measure_value: String;
};

export type MeasuresCreateInput = {
  id?: String | undefined;
  customer_code: String;
  measure_datetime?: String | Date | undefined;
  image_url: String;
  measure_type: MeasureType;
  measure_value: String;
};

export type FindMeasureByCustomerIdProps = {
  customer_code: string;
  measure_type?: MeasureType;
};

export interface MeasureRepository {
  findByIdMonthAndMeasureType(
    customer_code: String,
    date: String | Date,
    measure_type: MeasureType
  ): Promise<Measures | null>;
  findById(id: String): Promise<Measures | null>;
  findByCustomerId({
    customer_code,
    measure_type,
  }: FindMeasureByCustomerIdProps): Promise<Measures[]>;
  create(data: MeasuresCreateInput): Promise<Measures>;
  updateMeasureValue(id: String, measure_value: String): Promise<Measures>;
  getAll(): Promise<Measures[]>;
}
