import create_app from app.main


if __name__ == __main__:
        logger.info('Starting server')

        app = create_app()

        web.run_app(app)