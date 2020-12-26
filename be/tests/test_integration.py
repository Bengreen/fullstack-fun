from openapi_spec_validator import validate_spec



async def test_alive(cli):
    response = await cli.get('/alive')
    assert response.status == 200
    assert response.content_type == 'application/json'
   
    assert 'alive' in await response.json()


async def test_ready(cli):
    response = await cli.get('/ready')
    assert response.status == 200
    assert response.content_type == 'application/json'
   
    assert 'ready' in await response.json()


async def test_oas(cli, settings):
    response = await cli.get(settings.base_path+'/oas/spec')
    assert response.status == 200
    assert response.content_type == 'application/json'
   
    oas = await response.json()

    validate_spec(oas)

