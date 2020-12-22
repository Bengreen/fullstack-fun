from aiohttp import web


async def k8s_ready(request):
    return web.json_response( {"ready": True})

async def k8s_alive(request):
    return web.json_response( {"alive": True})

