# -*-coding:utf-8-*-
# 定时任务
from . import config, utils
from asarPy import pack_asar
import os
import shutil
import requests
import base64
import time


def upload_plugins_to_github():
    filelist = os.listdir(config.FILE_SAVE_PATH)
    time.sleep(30)
    for file_name in filelist:
        shutil.move(os.path.join(config.FILE_SAVE_PATH, file_name),
                    config.TO_UPLOAD_PATH)

    plugins_info_in_github = utils.getPluginsInfoInGithub()
    asar_md5_s = [item["asarMd5"] for item in plugins_info_in_github]
    for file_name in filelist:
        file_path = os.path.join(config.TO_UPLOAD_PATH, file_name)
        try:
            asar_md5 = utils.checkPlugin(file_path)
        except:
            os.remove(file_path)    # 将不符合 uTools 插件格式文件删除
            continue
        if asar_md5 in asar_md5_s:
            os.remove(file_path)    # 如果 Github 上已经存在，也删除

    if not os.listdir(config.TO_UPLOAD_PATH):
        return

    packed_file_path = os.path.join(config.TEMP_PATH, "plugins.asar")
    pack_asar(config.TO_UPLOAD_PATH, packed_file_path)
    requests.put(
        "https://api.github.com/repos/marsvet/uTools-plugins-collection/contents/plugins.asar", headers={
            "Authorization": f"token {config.GH_TOKEN}"
        }, json={
            "message": "Upload plugins",
            "content": base64.b64encode(open(packed_file_path, "rb").read()).decode("utf-8")
        })
    os.remove(packed_file_path)
    for file_name in os.listdir(config.TO_UPLOAD_PATH):
        os.remove(os.path.join(config.TO_UPLOAD_PATH, file_name))
