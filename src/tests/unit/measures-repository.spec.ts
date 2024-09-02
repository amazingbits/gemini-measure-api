import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryMeasuresRepository } from "../../repositories/in-memory/in-memory-measures-repository";
import { MeasuresCreateInput } from "../../repositories/measures-repository";
import { v4 as UUIDV4 } from "uuid";

let measuresRepositoryMock: InMemoryMeasuresRepository;

const firstMeasureCode = UUIDV4().toString();
const firstMeasure: MeasuresCreateInput = {
  customer_code: firstMeasureCode,
  image_url: "base64://image",
  measure_type: "WATER",
  measure_value: "0.0022",
};

const secondMeasureCode = UUIDV4().toString();
const secondMeasure: MeasuresCreateInput = {
  customer_code: secondMeasureCode,
  image_url: "base64://image",
  measure_type: "WATER",
  measure_value: "0.0025",
};

beforeEach(() => {
  measuresRepositoryMock = new InMemoryMeasuresRepository();
});

describe("Measures Repository tests", () => {
  it("should be able to create a new measure", async () => {
    const createMeasure = await measuresRepositoryMock.create(firstMeasure);
    expect(createMeasure.customer_code).toBe(firstMeasureCode);
  });

  it("should be able to update a measure value from created measure", async () => {
    const createdMeasure = await measuresRepositoryMock.create(firstMeasure);
    const updatedMeasure = await measuresRepositoryMock.updateMeasureValue(
      createdMeasure.id,
      "0.0025"
    );
    expect(updatedMeasure.measure_value).toBe("0.0025");
  });

  it("should be able to find a measure by id", async () => {
    const createdMeasure = await measuresRepositoryMock.create(firstMeasure);
    const foundMeasure = await measuresRepositoryMock.findById(
      firstMeasureCode
    );
    expect(foundMeasure).toEqual(createdMeasure);
  });

  it("should be able to find a measure by id, month and type", async () => {
    const createdMeasure = await measuresRepositoryMock.create({
      ...firstMeasure,
      measure_datetime: new Date(),
    });
    const currentDate = new Date();
    const foundMeasure =
      await measuresRepositoryMock.findByIdMonthAndMeasureType(
        firstMeasureCode,
        currentDate,
        "WATER"
      );
    expect(foundMeasure).toEqual(createdMeasure);
  });
});
