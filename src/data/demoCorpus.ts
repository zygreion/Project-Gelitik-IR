/**
 * DEMONSTRATION DATA ONLY.
 *
 * These 20 records are a verbatim copy of the project corpus
 * (IR_C1_2310511141_antara_politik_indonesia.xlsx) so the frontend can be
 * developed and demoed before the IR backend is live. They are used only
 * while VITE_USE_MOCK_DATA=true and are always surfaced with a demo badge.
 *
 * Do not treat this file as an authoritative index of political data.
 */

import type { MockDocument } from "../types/search";
import { data } from "./data";

export const DEMO_CORPUS: MockDocument[] = data.map((d) => {
  const { doc_id, title, date, media, topic, url, author, text } = d;

  return {
    id: doc_id,
    title,
    date,
    media,
    topic,
    url,
    author,
    text: text.join(" "),
  };
});
