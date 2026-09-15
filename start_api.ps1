Get-Content .env.local | ForEach-Object {
    if ($_ -match '^(.*?)=(.*)$') {
        Set-Item -Path "env:\$($matches[1])" -Value $matches[2].Trim('"')
    }
}

$env:PORT='5000'
pnpm --filter @workspace/api-server run build
node ./artifacts/api-server/dist/index.mjs
