import assert from "node:assert/strict";
import test from "node:test";
import {
  PAYWALL_MESSAGE,
  THERAPEUTIC_DISCLAIMER,
  createDeterministicAnamnesisResponse,
  mergeGeneratedAnamnesisResponse,
  parseAnamnesisRequest,
} from "../src/lib/anamnesisResponse";

function responseFor(body: Record<string, unknown>) {
  return createDeterministicAnamnesisResponse(parseAnamnesisRequest(body));
}

test("normaliza e limita dados não confiáveis da requisição", () => {
  const parsed = parseAnamnesisRequest({
    nome: "  Ana\u0000   Maria  ",
    nivel_estresse: 99,
    queixas_principais: ["fadiga", { indevido: true }, ""],
    usuario_premium: "true",
  });

  assert.equal(parsed.nome, "Ana Maria");
  assert.equal(parsed.nivel_estresse, 10);
  assert.deepEqual(parsed.queixas_principais, ["fadiga"]);
  assert.equal(parsed.usuario_premium, true);
});

test("reconhece exaustão sem acento e recomenda o ciclo emergencial", () => {
  const result = responseFor({ relato_livre: "Estou com exaustao e sem energia", usuario_premium: true });

  assert.match(result.padrao_emocional_detectado, /Esgotamento/);
  assert.match(result.ciclo_recomendado, /7 Dias.*528Hz/);
  assert.match(result.receita_integrativa.floral_bach, /Olive/);
  assert.match(result.receita_integrativa.aromaterapia_oleo, /Alecrim/);
  assert.equal(result.matriz_vibracional_audio.length, 6);
});

test("prioriza um padrão emocional explícito sobre estresse elevado", () => {
  const result = responseFor({ estados_emocionais: ["Oscilações de humor"], nivel_estresse: 10, usuario_premium: true });

  assert.match(result.padrao_emocional_detectado, /Instabilidade/);
  assert.match(result.receita_integrativa.floral_bach, /Scleranthus/);
  assert.match(result.receita_integrativa.aromaterapia_oleo, /Gerânio/);
});

test("mantém receita bloqueada e inclui os campos obrigatórios no plano gratuito", () => {
  const result = responseFor({ queixas_principais: ["tristeza profunda"], usuario_premium: false });

  assert.equal(result.receita_integrativa.floral_instrucao, PAYWALL_MESSAGE);
  assert.equal(result.receita_integrativa.aromaterapia_instrucao, PAYWALL_MESSAGE);
  assert.equal(result.nota_terapeutica_disclaimer, THERAPEUTIC_DISCLAIMER);
  assert.equal(result.status_servidor, "purificado_chama_violeta");
});

test("não permite que a resposta do provedor sobrescreva regras de segurança", () => {
  const canonical = responseFor({ nome: "Lia", queixas_principais: ["burnout"], usuario_premium: false });
  const merged = mergeGeneratedAnamnesisResponse({
    paciente_nome: "Outra pessoa",
    padrao_emocional_detectado: "Narrativa personalizada",
    justificativa_terapeutica: "Acolhimento personalizado",
    receita_integrativa: { floral_bach: "Receita vazada" },
    nota_terapeutica_disclaimer: "",
    status_servidor: "não purificado",
  }, canonical);

  assert.equal(merged.paciente_nome, "Lia");
  assert.equal(merged.padrao_emocional_detectado, "Narrativa personalizada");
  assert.equal(merged.receita_integrativa, canonical.receita_integrativa);
  assert.equal(merged.nota_terapeutica_disclaimer, THERAPEUTIC_DISCLAIMER);
  assert.equal(merged.status_servidor, "purificado_chama_violeta");
});

test("rejeita retorno não estruturado do provedor", () => {
  const canonical = responseFor({});
  assert.throws(() => mergeGeneratedAnamnesisResponse("texto solto", canonical), /inválida/);
  assert.throws(() => mergeGeneratedAnamnesisResponse({}, canonical), /incompleta/);
});
