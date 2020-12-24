from pathlib import Path
# from os import environ

import aiohttp_jinja2
import aiohttp_session
# import asyncpg
import jinja2
from aiohttp import web
from aiohttp_session.cookie_storage import EncryptedCookieStorage

from aiohttp_pydantic.oas.view import generate_oas

# from .db import prepare_database
from .settings import Settings
from .views import ArticleView
# from .views import index, message_data, messages
from aiohttp_pydantic import oas
from aiohttp_pydantic.oas.struct import OpenApiSpec3

from .platform_view import k8s_alive, k8s_ready, oas_spec

import logging

logger = logging.getLogger(__name__)


THIS_DIR = Path(__file__).parent


async def startup(app: web.Application):
    settings: Settings = app['settings']
    # await prepare_database(settings, False)
    # app['pg'] = await asyncpg.create_pool(dsn=settings.pg_dsn, min_size=2)


async def cleanup(app: web.Application):
    pass
    # await app['pg'].close()

def base_spec():
    # spec = OpenApiSpec3()
    # spec.info.title = 'Monkey'

    return  {
        'info': {
            'title': 'Monkey',
            'version': '0.0.1'
        }
    }


async def create_app():
    app = web.Application()
    settings = Settings()
    app.update(
        settings=settings,
        static_root_url='/static/',
    )

    jinja2_loader = jinja2.FileSystemLoader(str(THIS_DIR / 'templates'))
    aiohttp_jinja2.setup(app, loader=jinja2_loader)

    app.on_startup.append(startup)
    app.on_cleanup.append(cleanup)

    aiohttp_session.setup(app, EncryptedCookieStorage(settings.auth_key, cookie_name=settings.cookie_name))


    basePath = settings.base_path
    logger.info(f'App BASE_PATH={basePath}')

    # Register platform endpoints
    app.add_routes([web.get('/alive', k8s_alive),
                    web.get('/ready', k8s_ready),
                    web.get('/oas/spec', oas_spec)
                    ])

    # Register application endpoints
    app.router.add_view(basePath+'/article', ArticleView)

    # app.router.add_get('/', index, name='index')
    # app.router.add_route('*', '/messages', messages, name='messages')
    # app.router.add_get('/messages/data', message_data, name='message-data')
 

    app['oas_spec'] = base_spec()
    app['oas_spec'].update(generate_oas([app]))
   
    print(f'OAS Spec = {app["oas_spec"]}')

    # oas.setup(app)



    for resource in app.router.resources():
        logger.info(resource)
        print(resource)

    return app

def main(argv):
    logging.basicConfig(level=logging.DEBUG)

    app = create_app()

   
    web.run_app(app,
                host='0.0.0.0',
                port='8080')
