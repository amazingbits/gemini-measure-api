export type MeasureLLMResponseResource = {
  product_name: string;
  reading: number | string;
  serial_number: string | null;
  unit: string | null;
  is_valid: boolean;
  max_flow?: number | null;
  max_pressure?: number | null;
  min_flow?: number | null;
};
