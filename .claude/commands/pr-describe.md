# Comando /pr-describe

Gere a descrição do PR com base no diff atual.

## 1. Colete o contexto
```bash
git log main..HEAD --oneline
git diff main...HEAD --stat
git diff main...HEAD
```

Leia também:
- docs/backlog.md — identifique qual feature este PR entrega
- docs/api-contracts.md — identifique endpoints adicionados ou alterados

## 2. Gere a descrição no formato abaixo

---

## O que mudou

[Bullet points objetivos — o que foi adicionado, alterado ou removido.
Seja específico: nome de entidades, endpoints, componentes.]

## Por que mudou

[Contexto da feature ou decisão técnica. Referencie a feature do backlog
(ex: F02 — Saves) e o critério de aceite que está sendo entregue.]

## Endpoints afetados

| Método | Rota | Status |
|---|---|---|
| GET | /api/v1/saves | novo |
| POST | /api/v1/saves | novo |

[Omita esta seção se não houve mudança em endpoints]

## Como testar manualmente

1. [Passo a passo concreto para validar o comportamento no browser ou via Swagger]
2. [Inclua dados de exemplo quando relevante]
3. [Inclua o cenário de erro esperado quando aplicável]

## Checklist

- [ ] API responde corretamente no Swagger (http://localhost:5000/swagger)
- [ ] Frontend exibe os dados na rota correspondente (http://localhost:4200)
- [ ] docs/api-contracts.md atualizado
- [ ] docs/database-schema.md atualizado (se houve mudança de schema)

---

## 3. Mostre o comando gh pronto para copiar

```bash
gh pr create \
  --title "[F0X] Título curto e objetivo" \
  --body "$(cat <<'EOF'
[cole a descrição gerada acima]
EOF
)"
```
