from flask import Blueprint, request, jsonify
from . import config
from .utils import md5sum
import os

api = Blueprint('api', __name__)


@api.route("/upload", methods=['POST'])
def upload():
    try:
        file = request.files["file"]
        file_md5 = md5sum(file.read())
        file.seek(0)
        save_path = os.path.join(config.FILE_SAVE_PATH, file_md5 + ".upx")
        if not os.path.exists(save_path):
            file.save(save_path)
    except:
        return jsonify({"success": False})
    return jsonify({'success': True})
