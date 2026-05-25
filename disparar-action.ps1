<#
.SYNOPSIS
    Script para activar un flujo de GitHub Actions mediante Repository Dispatch.
.PARAMETER Mensaje
    El texto personalizado que se enviará en el client_payload.
#>
param (
    [string]$Mensaje = "¡Despierta desde mi PowerShell en Windows!"
)

# 1. Definimos las variables de tu repositorio
$usuario = "raulmaciasdev"
$repo = "gh-action-greeting-issue"
$evento = "activacion_manual_externa"

Write-Host "Iniciando Repository Dispatch para $usuario/$repo..." -ForegroundColor Cyan

# 2. Creamos el cuerpo completo de la petición y lo convertimos a JSON limpio
$body = @{
    event_type     = $evento
    client_payload = @{
        mensaje = $Mensaje
        usuario = "Desarrollador Win"
    }
} | ConvertTo-Json -Compress -Depth 3

# 3. Lanzamos el comando gh api inyectando el JSON a través de la tubería
$body | gh api `
    --method POST `
    -H "Accept: application/vnd.github+json" `
    -H "X-GitHub-Api-Version: 2022-11-28" `
    "/repos/$usuario/$repo/dispatches" `
    --input -

# 4. Validamos si el comando se ejecutó correctamente
if ($LASTEXITCODE -eq 0) {
    Write-Host "¡Evento '$evento' enviado con éxito!" -ForegroundColor Green
}
else {
    Write-Host "Hubo un error al enviar el evento." -ForegroundColor Red
}