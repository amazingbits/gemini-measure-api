import * as path from "node:path";
import moduleAlias from "module-alias";

const files = path.resolve(__dirname, "../..");

moduleAlias.addAliases({
  "@src": path.join(files, "src"),
  "@controllers": path.join(files, "src/http/controllers"),
  "@routes": path.join(files, "src/routes"),
  "@lib": path.join(files, "src/libs"),
  "@middlewares": path.join(files, "src/http/middlewares"),
  "@requests": path.join(files, "src/http/requests"),
  "@resources": path.join(files, "src/http/resources"),
  "@helpers": path.join(files, "src/helpers"),
  "@repositories": path.join(files, "src/repositories"),
  "@services": path.join(files, "src/services"),
});
