import os, json, requests
from flask import Flask, url_for, render_template, request, jsonify, Blueprint


from general import URLFrp

bp = Blueprint('providers', __name__,
                        template_folder='templates')


#Paginacion
@bp.route('/providers', methods=['GET', 'POST'])
def providersList():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        return render_template( 'providers/index.html' )
    
    #Cuando termina de cargar la pagina el javascrip pide la lista de los proveedores
    else:

        url = request.query_string.decode("utf-8")
        
        r = requests.get( url) 
        dataRes = r.json() 
        
        return jsonify( dataRes )



#Agrega provedores
@bp.route('/providers/add', methods=['GET', 'POST'])
def providersAdd():

    #Renderiza el template del formulario para agregar un proveedor
    if request.method == 'GET':
        
        return render_template( 'providers/add.html' )
    
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

        return jsonify( {'status_code': r.status_code } )



#Edita provedores
@bp.route('/providers/edit/<int:provider_id>', methods=['GET', 'POST', 'DELETE'])
def providersEdit(provider_id):

    #Renderiza el template del formulario para agregar un proveedor
    if request.method == 'GET':
        
        url = URLFrp + 'providers/' + str(provider_id)
        r = requests.get( url) 
        reqJ = r.json()

        if reqJ['id'] == None:
            displayExistRegister = "display:none;"
            titleDontExist = 'El registro no existe'
        else:
            displayExistRegister = ""
            titleDontExist = ''

        return render_template( 'providers/edit.html', 
                                data = reqJ, 
                                displayExistRegister = displayExistRegister,
                                titleDontExist = titleDontExist
                                )
    
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

        return jsonify( {'status_code': r.status_code } )

    elif request.method == 'DELETE':
        url = URLFrp + 'providers/' + str(provider_id)
        r = requests.delete( url )
        return jsonify( {'status_code': r.status_code } )



