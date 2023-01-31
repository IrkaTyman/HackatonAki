// общие настройки запроса
export const commonOptions = (body: any) => ({
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
})
