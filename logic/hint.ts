export async function getHint(keyword: string): Promise<string> {
    const req = { keyword };
    console.log(req)
    const response = await fetch(`/api/song`,
        {
            method: 'POST',
            body: JSON.stringify(req)
        });
    if (response.status !== 200) {
        alert("Error: " + response.status);
        console.log(response)
    }
    const data = await response.json();
    console.log(data)
    return data.result;
}