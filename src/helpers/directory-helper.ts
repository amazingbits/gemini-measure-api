import path from "node:path";
import fs from "node:fs";

export const makeDir = (folderName: string) => {
  const dirPath = path.resolve(__dirname, "..", folderName);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return dirPath;
};
