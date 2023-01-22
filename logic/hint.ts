export async function getHint(keyword: string): Promise<string> {
    const req = { keyword };
    console.log(req)
    const response = await fetch(`/api/song`,
        {
            method: 'POST',
            body: JSON.stringify(req)
        });
    const data = await response.json();
    console.log(data)
    return data.result;
}