import os
from flask import Flask, request,send_file,jsonify
from flask_cors import CORS
import requests
import openai

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

API_URL = "https://api-inference.huggingface.co/models/DrishtiSharma/finetuned-ViT-Indian-Food-Classification-v3"

headers = {"Authorization": "Bearer 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"}

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

openai.api_key = "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"


def openAI_Nutrition(food):
    response=openai.ChatCompletion.create(model="gpt-3.5-turbo",messages=[{"role":"system","content":"Output only general range of nutritional content of the given food per 100g. Only carbohydrates,calories,protiens,fat.Information should be strictly error free."},{"role":"user","content":"200 words to Give the nutrition value that is calories carbohydrates proteins fats for the food material "+food}])
    return_msg=response['choices'][0]['message']['content']
    return return_msg

def openAI_Allergy(food):
    response=openai.ChatCompletion.create(model="gpt-3.5-turbo",messages=[{"role":"system","content":"Output possible allergic reactions to the given food and the diseases for which the food should not be taken for."},{"role":"user","content":"200 words to give the information about the allergic nature of the food material and the diseases for which the food should be avoided and the foodname is"+food}])
    return_msg=response['choices'][0]['message']['content']
    return return_msg

def openAI_Chat(quetion):
    response=openai.ChatCompletion.create(model="gpt-3.5-turbo",messages=quetion)
    result=response['choices'][0]['message']['content']
    return result

def query(filename):
    with open(filename,"rb") as ip:
        data=ip.read()
    response=requests.post(API_URL,headers=headers,data=data)
    print(response)
    if(response):
        return response.json()
    else:
        query(filename)

@app.route('/api/upload', methods=['GET','POST'])
def upload():
    global filename
    global output
    if(request.method=='POST'):
        file=request.files['image']
        if file:
            filename=file.filename
            filepath=os.path.join(app.config['UPLOAD_FOLDER'],filename)
            file.save(filepath)
            return "done"
        else:
            return "error"
        
    if(request.method=='GET'):
        output=query('uploads/'+filename)[0]['label']
        if(output):
            # print(output)
            return output
        else:
            output=query('uploads/'+filename)[0]['label']
            return output

@app.route('/api/filename',methods=['GET'])
def get_img():
    # print(filename)
    return filename

@app.route('/api/get_image')
def get_image():
    
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    return send_file(image_path)

@app.route('/api/openaiInfo',methods=['GET'])
def information():
    #output=query('uploads/'+filename)[0]['label']
    if(1):
        output=query('uploads/'+filename)[0]['label']
        print("In information ",output)
        foodName=str(output)
        api_url = 'https://api.api-ninjas.com/v1/nutrition?query={}'.format("idli")
        response = requests.get(api_url, headers={'X-Api-Key': '32lT3N9bkz+Sxtjdqr8UaQ==QwFFkOoFHK5mnwz5'})
        nutrition_info=response.text
        #allergic_info=openAI_Allergy(str(output))
        return jsonify({'nutrition_content':str(nutrition_info)},{'allergic_reaction':str("Potential allergic reactions")})
    else:
        information()
        print("yyyyyyyyyyyyy")
        

@app.route('/api/answer',methods=['GET','POST'])
def Chat_withAI():
    chatting=[{"role": "system", "content": "You are a new fashion advisor and a fashion assisstant."}]
    if request.method=='POST':
        q=request.json['question']
        chatting.append({"role":"assistant","content":str(q)})
        output_chat=openAI_Chat(chatting)
        # print(output_chat)
        return jsonify({'answer':str(output_chat)})


if __name__ == '__main__':
    app.run(port=8000,debug =True)


        