import os, json, requests
from flask import Flask, url_for, render_template, request, jsonify

app = Flask(__name__)

URLFrp = 'http://localhost:5000/api/v1/' 

#Paginacion
@app.route('/providers', methods=['GET', 'POST'])
def providers():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        
        return render_template( 'providers/index.html')
    
    #Cuando termina de cargar la pagina el javascrip pide la lista de los proveedores
    else:
        data = request.get_json()
        
        paginationStart = data['paginationStart']
        paginationStep  = data['paginationStep']
        catalogue       = data['catalogue']

        url = URLFrp + catalogue
        PARAMS = {'X-Fields' :  str(paginationStart) + ',' + str(paginationStep) + ',id,ASC'} 

        r = requests.get( url, params = PARAMS  ) 
        data = r.json() 

        return jsonify( data = data )



#Agrega provedores
@app.route('/providers/add', methods=['GET', 'POST'])
def providersAdd():

    #Renderiza el template del formulario para agregar un proveedor
    if request.method == 'GET':
        
        return render_template( 'providers/add.html')
    
    #Cuando termina de cargar la pagina el javascrip pide la lista de los proveedores
    else:
        data = request.get_json()
        title = data['title']
        description  = data['description']
        
        data = { 'id': 0, 
                 'title': title, 
                 'description': description, 
                 'inceptor_uuid': 'string'
               }
        dataJSON = json.dumps(data)

        url = URLFrp + 'providers/'
        r = requests.post( url, data=dataJSON)

        return jsonify( data = data )



#Edita provedores
@app.route('/providers/edit/<int:provider_id>', methods=['GET', 'POST', 'DELETE'])
def providersEdit(provider_id):

    #Renderiza el template del formulario para agregar un proveedor
    if request.method == 'GET':
        
        url = URLFrp + 'providers/' + str(provider_id)
        r = requests.get( url) 
        reqJ = r.json()

        return render_template( 'providers/edit.html', data = reqJ)
    
    #Cuando termina de cargar la pagina el javascrip pide la lista de los proveedores
    elif request.method == 'POST':
        data = request.get_json()
        idProvider  = data['id']
        title       = data['title']
        description = data['description']
        
        data = { 'id'           : idProvider, 
                 'title'        : title, 
                 'description'  : description,
                 'inceptor_uuid': 'string'
               }

        dataJSON = json.dumps(data)

        url = URLFrp + 'providers/' + idProvider
        r = requests.put( url, data=dataJSON)

        return render_template( 'providers/index.html' )

    elif request.method == 'DELETE':
        url = URLFrp + 'providers/' + str(provider_id)
        r = requests.delete( url )
        return jsonify( 'yes' )

if __name__ == '__main__':
	app.run(port=8081, debug=True)
