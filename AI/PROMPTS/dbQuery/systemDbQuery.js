import { baseSystemInstruction } from "../../../utils/baseSystemInstruction.js";
import { resolveSchemaFragments } from "./schemaRouter.js";

export const systemDbQuery = (data_to_analyze) => {
  const { resumen_contexto = null, pregunta, historial_reciente = [] } = data_to_analyze || {};
  
  const contexto = resumen_contexto ? `\nCONTEXTO PREVIO:\n${resumen_contexto}\n` : "";
  const schema = resolveSchemaFragments(pregunta, historial_reciente);
  const prompt = `Eres un traductor de lenguaje natural a MySQL. Devuelve SOLO JSON.
${contexto}
SCHEMA RELEVANTE:
${schema}

FORMATO OBLIGATORIO (sin backticks, sin texto extra):
{
  "queryValida": false, 
  "razon": "operación de escritura — debe manejarse por endpoint dedicado. Datos recopilados: { ... }",
  "query": null,
  "parametros": []
}`
  return baseSystemInstruction(prompt);
};