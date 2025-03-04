import {
  createWriteStream,
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
} from "fs";
import path from "path";
import { checkTimeDifference, getCurrentDate } from "./dateTime";

const logDirectory = path.resolve(process.cwd());
const apiName = "API-TEMPLATE";

export const saveToLogFile = (logMessage: string) => {
  let stream;
  const logFilePath = path.resolve(
    `${logDirectory}`,
    `${apiName}.${getCurrentDate()}.log`
  );
  try {
    mkdirSync(logDirectory!, { recursive: true });
    stream = createWriteStream(logFilePath, { flags: "a" });
    stream.write(`${logMessage}\n`, "utf8");
  } catch (err) {
    console.log(
      `Não foi possível escrever o log: ${logMessage}\r\nErro: ${err}`
    );
  } finally {
    if (!stream?.closed) {
      stream?.end();
      stream?.close();
    }
  }

  deleteLogsGreaterThan15Days();
};

export function deleteLogsGreaterThan15Days() {
  try {
    const files = readdirSync(logDirectory!);

    files.forEach((file) => {
      if (file.startsWith(`${apiName}.`) && file.endsWith(".log")) {
        const filePath = path.join(logDirectory!, file);
        const stats = statSync(filePath);
        const fileBirthTime = new Date(stats.birthtime);
        const result = checkTimeDifference(fileBirthTime);
        if (result) {
          unlinkSync(filePath);
        }
      }
    });
  } catch (error) {
    console.log(`Não foi possível excluir o arquivo de log: ${error}`);
  }
}
