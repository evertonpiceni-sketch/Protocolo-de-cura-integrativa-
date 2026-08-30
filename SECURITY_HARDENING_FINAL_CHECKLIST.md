# Security Hardening Final Checklist

Branch de trabalho: `security-hardening-2026-08-30`

## Regra
- Nunca alterar `main`.
- Toda alteração deve ocorrer nesta branch.
- Nenhum item pode ser marcado como concluído sem evidência verificável.

## Critérios de aprovação
- [ ] autenticação real
- [ ] autorização real
- [ ] Premium protegido no backend
- [ ] Admin protegido no backend
- [ ] isolamento entre usuários
- [ ] Gemini protegido
- [ ] ElevenLabs protegido
- [ ] rate limiting funcionando
- [ ] Helmet funcionando
- [ ] validação funcionando
- [ ] secrets protegidos
- [ ] LGPD revisada
- [ ] conteúdo terapêutico revisado
- [ ] lint passando
- [ ] build passando
- [ ] testes de segurança passando
- [ ] produção configurada corretamente

## Testes obrigatórios
1. API sem login -> `401`.
2. Usuário comum -> admin -> `403`.
3. Usuário free enviando `usuario_premium=true` -> `403`/acesso negado.
4. Usuário A tentando acessar dados de B -> `403` ou `404`.
5. Excesso de requisições -> `429`.
6. Payload gigante -> `400` ou `413`.
7. Nenhuma API key no bundle/frontend.
8. Gemini/TTS sem login -> `401`.

## Observação
Este arquivo é apenas o checklist de aceite. A implementação deve ser feita no código, seguida de lint, build, auditoria de dependências e testes reais. Não usar validações apenas no frontend como mecanismo de segurança.
