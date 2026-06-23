import { systemDbAnswer } from "./systemDbAnswer.js";
import { userDbAnswer }   from "./userDbAnswer.js";

export const db_answer = {
  system:      systemDbAnswer,
  user:        userDbAnswer,
  tokens:      3000,
  temperature: 0.9,
  topP:        0.9,
  webSearch:   false,
};