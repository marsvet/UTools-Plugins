from flask import Flask
from flask_apscheduler import APScheduler
from config import Config
import shutil
import os

scheduler = APScheduler()
config = Config()


if os.path.exists(config.FILE_SAVE_PATH):
    shutil.rmtree(config.FILE_SAVE_PATH)
if os.path.exists(config.TO_UPLOAD_PATH):
    shutil.rmtree(config.TO_UPLOAD_PATH)
if os.path.exists(config.TEMP_PATH):
    shutil.rmtree(config.TEMP_PATH)
os.mkdir(config.FILE_SAVE_PATH)
os.mkdir(config.TO_UPLOAD_PATH)
os.mkdir(config.TEMP_PATH)


def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    scheduler.init_app(app)
    scheduler.start()

    from app.api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix="/api")

    return app
