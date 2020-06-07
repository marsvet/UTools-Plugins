# -*-coding:utf-8-*-
from app import config
from asarPy import extract_asar
import hashlib
import requests
import json
import gzip
import os
import shutil


# 计算字符串的 md5
def md5sum(s):
    hmd5 = hashlib.md5()
    hmd5.update(s)
    return hmd5.hexdigest()


# gzip 压缩文件
def gzipFile(source_path, target_path):
    fin = open(source_path, "rb")
    fout = gzip.open(target_path, 'wb')
    fout.writelines(fin)
    fin.close()
    fout.close()


# gzip 解压文件
def gunzipFile(source_path, target_path):
    fin = gzip.open(source_path, 'rb')
    fout = open(target_path, 'wb')
    fout.write(fin.read())
    fin.close()
    fout.close()


def getPluginsInfoInGithub():
    rsp = requests.get(
        "https://cdn.jsdelivr.net/gh/marsvet/uTools-plugins-collection@latest/plugins-info.json")
    return json.loads(rsp.content)


# 检查文件是否符合 uTools 插件格式，并计算 asar 文件的 md5
def checkPlugin(file_path):
    asar_file_path = os.path.join(config.TEMP_PATH, "plugin.asar")
    plugin_dir = os.path.join(config.TEMP_PATH, "plugin")

    try:
        # 如果文件不符合 uTools 插件格式，下面三行代码的某一行会报错
        gunzipFile(file_path, asar_file_path)
        extract_asar(asar_file_path, plugin_dir)
        json.load(open(os.path.join(plugin_dir, "plugin.json"), "rb"))
    except:
        if os.path.exists(asar_file_path):
            os.remove(asar_file_path)
        if os.path.exists(plugin_dir):
            shutil.rmtree(plugin_dir)
        raise Exception("文件不符合 uTools 插件格式")

    with open(asar_file_path, 'rb') as fp:
        asar_md5 = md5sum(fp.read())

    os.remove(asar_file_path)
    shutil.rmtree(plugin_dir)

    return asar_md5
