import { prisma } from "@libs/prisma";
import {
  MeasureRepository,
  Measures,
  MeasuresCreateInput,
  MeasureType,
} from "@repositories/measures-repository";

export class PrismaMeasuresRepository implements MeasureRepository {
  async findByCustomerId(customer_code: String): Promise<Measures | null> {
    const measure = await prisma.measures.findMany({
      where: {
        customer_code: customer_code.toString(),
      },
    });

    if (!measure) {
      return null;
    }

    return measure[0];
  }
  async findByIdMonthAndMeasureType(
    customer_code: string,
    date: string | Date,
    measure_type: MeasureType
  ): Promise<Measures | null> {
    const measure = await prisma.measures.findMany({
      where: {
        customer_code: customer_code,
        measure_datetime: {
          gte: new Date(date),
          lte: new Date(date),
        },
        measure_type: measure_type,
      },
    });

    if (!measure) {
      return null;
    }

    return measure[0];
  }

  async findById(id: string): Promise<Measures | null> {
    const measure = await prisma.measures.findMany({
      where: {
        id: id,
      },
    });

    if (!measure) {
      return null;
    }

    return measure[0];
  }
  async create(data: MeasuresCreateInput): Promise<Measures> {
    const measure = await prisma.measures.create({
      data,
    });

    return measure;
  }

  async updateMeasureValue(
    id: string,
    measure_value: string
  ): Promise<Measures> {
    const measure = await prisma.measures.update({
      where: {
        id: id,
      },
      data: {
        measure_value,
      },
    });

    return measure;
  }

  async getAll(): Promise<Measures[]> {
    const measures = await prisma.measures.findMany();
    return measures;
  }
}
