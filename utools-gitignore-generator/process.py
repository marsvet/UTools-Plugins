# -*- coding: utf-8 -*-
# 功能：删除 gitignore 项目中不需要的文件，并为其建立符合 utools 列表模式格式的索引文件
# 使用方式：克隆仓库后，先运行此脚本，再打包发布插件

import os
import json
import re
import shutil

source_dir = "./gitignore"
file_paths = []
indexes = []

# 获取所有文件路径
for item in os.walk(source_dir):
    file_paths.extend([os.path.join(item[0], i) for i in item[2]])

# 删除不需要的文件。链接文件替换为普通文件。
for file in file_paths:
    if not re.search(r'.*\.gitignore', file):
        os.remove(file)
        file_paths.remove(file)
        continue
    if os.path.islink(file):
        truth_filename = os.readlink(file)  # 被链接文件名
        dirname = os.path.dirname(file)  # 链接文件所在目录
        os.remove(file)  # 删除链接文件
        shutil.copy(os.path.join(dirname, truth_filename), file)

# 删除 .github 目录
if os.path.exists(os.path.join(source_dir, ".github")):
    os.rmdir(os.path.join(source_dir, ".github"))

# 生成索引文件
for file in file_paths:
    title = file.replace(source_dir + os.sep, "").replace(".gitignore", "")
    indexes.append({
        "title": title,
        "description": '按回车生成',
    })
with open("indexes.json", "w") as f:
    json.dump(indexes, f, ensure_ascii=False)
