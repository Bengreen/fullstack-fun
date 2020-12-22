from aiohttp_pydantic import PydanticView
from pydantic import BaseModel
from aiohttp import web
from typing import Optional


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

