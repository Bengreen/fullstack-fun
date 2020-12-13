import setuptools

setuptools.setup(
        name='be',
        version='0.0.0',
        author='Ben Greene',
        author_email='BenJGreene@gmail.com',
        description='OAS server',
        install_requires=[
            'aiohttp_pydantic'
            ],
        extras_require={
            'dev': [
                'aiohttp-devtools'
             ]
        },
        packages=setuptools.find_packages()
        )
