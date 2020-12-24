import setuptools

setuptools.setup(
        name='be',
        version='0.0.0',
        author='Ben Greene',
        author_email='BenJGreene@gmail.com',
        description='OAS server',
        install_requires=[
            'aiohttp_pydantic',
            # 'aiohttp_pydantic @ git+https://github.com/Bengreen/aiohttp-pydantic@main#egg=aiohttp_pydantic'
            'aiohttp_jinja2',
            'aiohttp-session[secure]',
            'aiohttp_jinja2'
            ],
        extras_require={
            'dev': [
                'aiohttp-devtools',
                'openapi-spec-validator',
                'pytest',
                'flake8',
                'pytest-aiohttp'
             ]
        },
        packages=setuptools.find_packages()
        )
