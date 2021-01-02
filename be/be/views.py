from aiohttp_pydantic import PydanticView
from pydantic import BaseModel
from aiohttp import web
from typing import Optional
from aiohttp_pydantic.oas.typing import r200, r201, r204, r404


class ArticleModel(BaseModel):
    name: str
    nb_page: Optional[int]


class Comments(BaseModel):
    with_comments: bool


class Error(BaseModel):
    error: str


# Create your PydanticView and add annotations.
class ArticleView(PydanticView):

    # async def post(self, article: ArticleModel):
    #     return web.json_response({'name': article.name,
    #                               'number_of_page': article.nb_page})

    async def get(self, with_comments: Optional[bool]) -> r200[ArticleModel]:
        return web.json_response({'name': 'Blobby',
                                   'number_of_page': 12})

