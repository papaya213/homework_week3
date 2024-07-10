from flask import Flask, request, jsonify, send_from_directory
import sys
import os

from utils import ArgumentParser, ConfigLoader, LOG
from model import GLMModel, OpenAIModel
from translator import PDFTranslator
from flask_cors import CORS

app = Flask(__name__)
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
TRANSLATED_FOLDER = UPLOAD_FOLDER
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['TRANSLATED_FOLDER'] = TRANSLATED_FOLDER
API_KEY = 'sk-yourkey'
os.environ['OPENAI_API_KEY']= API_KEY

CORS(app)

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

if not os.path.exists(TRANSLATED_FOLDER):
    os.makedirs(TRANSLATED_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    return jsonify({'message': 'File uploaded successfully', 'filePath': file_path})


@app.route('/translate', methods=['GET'])
def translate_file():
    filename = request.args.get('filename')
    model_name = request.args.get('modelType')
    file_format = request.args.get('fileType')
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    lang_code = request.args.get('language')
    language = '中文'
    if lang_code == 'fr':
        language = '法语'
    elif lang_code == 'eg':
        language = '英语'
    elif lang_code == 'jp':
        language = '日语'
    elif lang_code == 'de':
        language = '德语'
    else:
        language = '中文'


    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    if not language:
        return jsonify({'error': 'No language provided'}), 400
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(file_path):
        return jsonify({'error': 'File not found'}), 404

    base, extension = os.path.splitext(filename)
    translated_filename = f"{base}_translated.md"
    translated_file_path = os.path.join(UPLOAD_FOLDER, translated_filename)

    model = OpenAIModel(model=model_name, api_key=API_KEY)



    translator = PDFTranslator(model)
    translator.translate_pdf(file_path, file_format, language)

    return jsonify({'translatedFileName': translated_filename})


@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    file_path = os.path.join(app.config['TRANSLATED_FOLDER'], filename)
    
    if os.path.exists(file_path):
      return send_from_directory(app.config['TRANSLATED_FOLDER'], filename)
    else:
      # Handle case where file doesn't exist (e.g., return 404 Not Found)
      return 'File not found', 404


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=2234)
