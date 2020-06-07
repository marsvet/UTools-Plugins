# -*-coding:utf-8-*-
#
import os


basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    JSON_AS_ASCII = False
    FILE_SAVE_PATH = "./raw/plugins"
    TO_UPLOAD_PATH = "./raw/toUpload"
    TEMP_PATH = "./raw/temp"
    GH_TOKEN = os.environ.get('GH_TOKEN')

    JOBS = [{
        'id': 'upload_plugins_to_github',
        'func': 'app.tasks:upload_plugins_to_github',
        'trigger': 'interval',
        'minutes': 5    # 每 5 分钟执行一次
    }]
