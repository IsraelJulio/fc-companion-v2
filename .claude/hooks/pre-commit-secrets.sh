#!/bin/bash
# Lê o JSON enviado pelo Claude Code via stdin
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(data.get('tool_input', {}).get('command', ''))
" 2>/dev/null || echo "")

# Só age em git commit
if echo "$COMMAND" | grep -qE 'git commit'; then
    DIFF=$(git diff --staged 2>/dev/null)
    # Detecta padrões comuns de credenciais hardcoded
    if echo "$DIFF" | grep -qiE \
        '(Password\s*=\s*[^;]{4,}|"Key"\s*:\s*"[A-Za-z0-9]{8,}"|api_key\s*=\s*\S+|Bearer\s+[A-Za-z0-9]{20,}|secret\s*=\s*\S+)'; then
        echo "BLOQUEADO: possível credencial detectada no diff staged." >&2
        echo "Revise os arquivos antes de commitar." >&2
        exit 2
    fi
fi
exit 0
