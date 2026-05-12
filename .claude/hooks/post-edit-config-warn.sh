#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
tip = data.get('tool_input', {})
print(tip.get('file_path', tip.get('path', '')))
" 2>/dev/null || echo "")

# Arquivos de configuração sensíveis neste projeto
if echo "$FILE_PATH" | grep -qiE \
    '(appsettings\.(Development|Production|Staging)\.json|secrets\.json|\.env(\.|$)|launchSettings\.json)'; then
    echo "AVISO: arquivo de configuração sensível editado:" >&2
    echo "  $FILE_PATH" >&2
    echo "Verifique se não há credenciais hardcoded antes de commitar." >&2
fi
exit 0
