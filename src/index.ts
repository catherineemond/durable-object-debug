import { FlagDO } from './data';

const getStub = (env: any) => {
  const id = env.FLAG_DURABLE_OBJECT.idFromName('flags');
  return env.FLAG_DURABLE_OBJECT.get(id);
};

export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);
    const path = url.pathname;
    const stub = getStub(env);
    
    try {
      if (request.method === 'POST' && path === '/api/flags') {
        const flag = await request.json();
        const result = await stub.upsertFlag(flag);
        return Response.json(result);
      } 
      else if (request.method === 'GET' && path === '/api/flags' && url.searchParams.has('handle')) {
        const handle = url.searchParams.get('handle')!;
        const flag = await stub.getFlagByClientHandle(handle);
        return Response.json(flag || { error: 'Flag not found' });
      }
      else if (request.method === 'GET' && path === '/api/flags') {
        const flags = await stub.getAllFlags();
        return Response.json(flags);
      }
      else {
        return new Response('Not found', { status: 404 });
      }
    } catch (e) {
      const error = e as Error;
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
};

export { FlagDO };