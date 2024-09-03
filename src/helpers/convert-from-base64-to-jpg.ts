import fs from "node:fs";
import { makeDir } from "@helpers/directory-helper";

export const convertFromBase64ToJPG = (
  base64String: string,
  fileName: string
) => {
  const outputPath = makeDir("uploads");
  const base64Data = base64String.replace(/^data:image\/jpeg;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  fs.writeFile(outputPath + fileName, buffer, (err) => {
    if (err) {
      throw new Error(err.message);
    } else {
      return true;
    }
  });
  return outputPath + "/" + fileName;
};
