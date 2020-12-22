import sys
import logging
from .main import create_app
from aiohttp import web

def main(argv):
    logging.basicConfig(level=logging.DEBUG)

    app = create_app()

   
    web.run_app(app,
                host='0.0.0.0',
                port='8080')


if __name__ == '__main__':
    print('Starting app')
    main(sys.argv[1:])