from typing import Optional

from aiohttp import web
from aiohttp_pydantic import PydanticView
from pydantic import BaseModel
from aiohttp_pydantic import oas

from os import environ
import logging

# Use pydantic BaseModel to validate request body
class ArticleModel(BaseModel):
    name: str
    nb_page: Optional[int]


# Create your PydanticView and add annotations.
class ArticleView(PydanticView):

    async def post(self, article: ArticleModel):
        return web.json_response({'name': article.name,
                                  'number_of_page': article.nb_page})

    async def get(self, with_comments: Optional[bool]):
        return web.json_response({'with_comments': with_comments})


basePath = environ.get('BASE_PATH', '/')
logging.info(f'App BASE_PATH={basePath}')


app = web.Application()

app.router.add_view(f'{basePath}article', ArticleView)

oas.setup(app)
# import pdb; pdb.set_trace()
web.run_app(app)
