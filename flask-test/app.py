from flask import Flask, request, jsonify, session
import os
import logging
import waferdefects
import numpy as np
import cv2
from PIL import Image


logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('HELLO WORLD')

app = Flask(__name__)
UPLOAD_FOLDER = 'Users\swath\Dropbox\My PC (LAPTOP-9DJTOMPR)\Downloads\project-20221029T235730Z-001\project\files'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(24)


# def checkSimilarity(filePath):
#     defects.predict_image()
#     return {'accuracy': '30', 'defects': '10' }

    
@app.route('/')
def hello_world():
    return 'This is my first API call!'

@app.route('/check-similarity', methods=['POST'])
def fileUpload():
    logger.info("1 welcome to upload")
    
    target=os.path.join(os.getcwd(),'test_docs')
    print("2 File:", target)
    if not os.path.isdir(target):
        os.mkdir(target)
    logger.info("welcome to upload")
    file = request.files['file'] 
    print("File:", file)
    destination="/".join([target, file.filename])
    print("destination:", destination)
    file.save(destination)
    print("after save:")
    session['uploadFilePath']=destination
    img= Image.open(destination, mode='r')
    img_rgb = img.convert('RGB')
    img_rgb.show()
    numpydata = np.asarray(img_rgb)
    print("after from file", numpydata.shape)
    res = waferdefects.predict_image(numpydata)
    print("After API Call:", res)
    response = jsonify(res)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# if __name__ == "__main__":
#     app.secret_key = os.urandom(24)
#     app.run(debug=True,host="0.0.0.0",use_reloader=False)

# flask_cors.CORS(app, expose_headers='Authorization')

