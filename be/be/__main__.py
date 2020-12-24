import sys
import logging
from .main import main
from aiohttp import web



if __name__ == '__main__':
    print('Starting app')
    main(sys.argv[1:])