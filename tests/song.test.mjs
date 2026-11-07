import assert from 'node:assert/strict';
import { test } from 'node:test';
import handler from '../pages/api/song.ts';
import { getHint } from '../logic/hint.ts';

function response() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

test('song API validates input and handles OpenAI responses', async (t) => {
  const originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'test-key';
  t.after(() => {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
  });
  t.mock.method(console, 'error', () => {});

  await t.test('missing credentials return JSON without constructing a client', async () => {
    delete process.env.OPENAI_API_KEY;
    const res = response();
    await handler({ method: 'POST', body: { keyword: 'APPLE' } }, res);
    assert.equal(res.statusCode, 503);
    assert.match(res.body.error[0], /利用できません/);
    process.env.OPENAI_API_KEY = 'test-key';
  });

  await t.test('GET and malformed or invalid JSON are rejected', async () => {
    const res = response();
    await handler({ method: 'GET' }, res);
    assert.equal(res.statusCode, 405);
    assert.equal(res.headers.Allow, 'POST');
    for (const body of ['{', null, { keyword: 123 }, { keyword: '  ' }]) {
      const invalid = response();
      await handler({ method: 'POST', body }, invalid);
      assert.equal(invalid.statusCode, 400);
    }
  });

  await t.test('both parsed JSON and legacy text bodies generate a poem', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({
      choices: [{ message: { content: '赤く実り\n枝に揺れ\n甘く香り\n秋を告げる' } }]
    }), { headers: { 'Content-Type': 'application/json' } }));
    for (const body of [{ keyword: 'APPLE' }, '{"keyword":"APPLE"}']) {
      const res = response();
      await handler({ method: 'POST', body }, res);
      assert.equal(res.statusCode, 200);
      assert.match(res.body.result, /秋を告げる/);
    }
  });

  for (const [status, code, message] of [
    [429, 'insufficient_quota', /利用枠/],
    [429, 'rate_limit_exceeded', /混み合って/],
    [401, 'invalid_api_key', /利用できません/]
  ]) {
    await t.test(`SDK ${status} ${code} returns a safe error`, async (t) => {
      t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({
        error: { message: 'sensitive upstream detail', type: code, code }
      }), { status, headers: { 'Content-Type': 'application/json', 'x-should-retry': 'false' } }));
      const res = response();
      await handler({ method: 'POST', body: { keyword: 'APPLE' } }, res);
      assert.equal(res.statusCode, 503);
      assert.match(res.body.error[0], message);
      assert.doesNotMatch(JSON.stringify(res.body), /sensitive upstream detail|test-key/);
    });
  }

  await t.test('empty completions are rejected', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ choices: [] }), {
      headers: { 'Content-Type': 'application/json' }
    }));
    const res = response();
    await handler({ method: 'POST', body: { keyword: 'APPLE' } }, res);
    assert.equal(res.statusCode, 502);
  });
});

test('getHint throws recoverable errors and sends JSON', async (t) => {
  await t.test('quota error is preserved for display', async (t) => {
    t.mock.method(globalThis, 'fetch', async (_url, options) => {
      assert.equal(options.headers['Content-Type'], 'application/json');
      return new Response(JSON.stringify({ error: ['現在、出題サービスの利用枠に達しています。'] }), { status: 503 });
    });
    await assert.rejects(getHint('APPLE'), /利用枠/);
  });

  await t.test('HTML errors and empty results do not reach the game', async (t) => {
    const fetch = t.mock.method(globalThis, 'fetch', async () => new Response('<html>Error</html>', { status: 500 }));
    await assert.rejects(getHint('APPLE'), /出題に失敗/);
    fetch.mock.mockImplementation(async () => new Response(JSON.stringify({ result: '' })));
    await assert.rejects(getHint('APPLE'), /ポエムを取得できません/);
  });
});
