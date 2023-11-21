# Importa as bibliotecas necessárias
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

# Cria a aplicação Flask
app = Flask(__name__)
CORS(app)

# Tenta criar o arquivo Text.csv caso ele não exista e escreve o cabeçalho
try:
    open('Text.csv', 'x')
    with open("Text.csv", "w") as arquivo:
         arquivo.write("ID,TAREFA\n") 
except:
    pass

@app.route("/list", methods=['GET'])
def listarTarefas():    
    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas.to_dict('records')    
    return jsonify(tarefas)

@app.route("/add", methods=['POST'])
def addTarefas():
    item = request.json  
    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas.to_dict('records') 
    id = len(tarefas) + 1
    with open("Text.csv", "a") as arquivo:
         arquivo.write(f"{id},{item['Tarefa']}\n")    
    tarefas = pd.read_csv('Text.csv')
    tarefas = tarefas.to_dict('records')        
    return jsonify(tarefas)

@app.route("/delete", methods=['DELETE'])
def deleteTarefa():
    data = request.json
    id = data.get('id')

    if id is None:
        return jsonify({"error": "ID da tarefa não fornecido"}), 400

    tarefas = pd.read_csv('Text.csv')

    if id not in tarefas['ID'].values:
        return jsonify({"error": "Tarefa não encontrada"}), 404

    tarefas = tarefas.drop(tarefas[tarefas['ID'] == id].index)

    tarefas['ID'] = range(1, len(tarefas) + 1)

    tarefas.to_csv('Text.csv', index=False)

    return jsonify(tarefas.to_dict('records'))

@app.route("/update", methods=["PUT"])
def update_task():
    data = request.json
    id = data.get('id')
    nova_tarefa = data.get('nova_tarefa')

    if id is None or nova_tarefa is None:
        return jsonify({"error": "ID da tarefa e/ou nova tarefa não fornecidos"}), 400

    tarefas = pd.read_csv('Text.csv')

    if id not in tarefas['ID'].values:
        return jsonify({"error": "Tarefa não encontrada"}), 404

    tarefas.loc[tarefas['ID'] == id, 'TAREFA'] = nova_tarefa

    tarefas.to_csv('Text.csv', index=False)

    return jsonify(tarefas.to_dict('records'))


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")