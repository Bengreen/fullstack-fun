import pytest

from be.main import create_app

@pytest.fixture
async def cli(loop, aiohttp_client):
    app = await create_app()
    return await aiohttp_client(app)

@pytest.fixture
def settings(cli):
    return cli.app['settings']

