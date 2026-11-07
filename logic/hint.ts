export async function getHint(keyword: string): Promise<string> {
    const req = { keyword };
    const response = await fetch(`/api/song`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req)
        });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const message = Array.isArray(data?.error)
            ? data.error.filter((value: unknown) => typeof value === 'string').join('\n')
            : '';
        throw new Error(message || '出題に失敗しました。時間をおいてもう一度お試しください。');
    }
    if (typeof data?.result !== 'string' || !data.result.trim()) {
        throw new Error('ポエムを取得できませんでした。もう一度お試しください。');
    }
    return data.result;
}
