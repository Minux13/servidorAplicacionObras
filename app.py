import os, json, requests
from flask import Flask, url_for, render_template, request, jsonify

import general

app = Flask(__name__)

#http://15.164.48.84/api/v1/
#http://localhost:90/api/v1/
URLFrp = 'http://15.164.48.84/api/v1/' 

#Paginacion
@app.route('/providers', methods=['GET', 'POST'])
def providers():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        return render_template( 'providers/index.html', catalog='providers',  menu = general.menuProvider, title='Proveedores' )
    
    #Cuando termina de cargar la pagina el javascrip pide la lista de los proveedores
    else:
        data = request.get_json()
        
        paginationStart = data['paginationStart']
        paginationStep  = data['paginationStep']
        paginationBy    = data['by']
        paginationOrder = data['order']

        #?offset=9&limit=10&order_by=id&order=ASC

        countAmount = requests.get( URLFrp + 'providers/count' ).json()['count']
        print(countAmount)

        queryStr = 'providers/?offset=' + str(paginationStart) + '&limit=' + str(paginationStep)  + '&order_by=' + str(paginationBy) + '&order=' + str(paginationOrder)
        url = URLFrp + queryStr
        
        r = requests.get( url) 
        dataRes = r.json() 
        
        return jsonify( { 'data' : dataRes, 'count' : countAmount} )



#Agrega provedores
@app.route('/providers/add', methods=['GET', 'POST'])
def providersAdd():

    #Renderiza el template del formulario para agregar un proveedor
    if request.method == 'GET':
        
        return render_template( 'providers/add.html', catalog='providers', menu = general.menuProvider )
    
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

        return render_template( 'providers/edit.html', data = reqJ, catalog = 'providers', menu = general.menuProvider )
    
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

        return jsonify( {'success':'success'} )

    elif request.method == 'DELETE':
        url = URLFrp + 'providers/' + str(provider_id)
        r = requests.delete( url )
        return jsonify( 'yes' )






########   Contrato   #######3

#Paginacion
@app.route('/contracts', methods=['GET', 'POST'])
def contracts():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        
        return render_template( 'contracts/index.html', catalog='contracts', menu = general.menuContract, title='Contratos' )
    
    else:
        data = request.get_json()
        
        print("////////////")
        print(data)
        paginationStart     = data['paginationStart']
        paginationStep      = data['paginationStep']
        paginationBy        = data['by']
        paginationOrder     = data['order']
        searchBy            = data['searchBy']
        valueSearchBy       = data['valueSearchBy']
        


        if searchBy == '':
            urlCount = URLFrp + 'contracts/count'
            searchQuery = '' 
        else:
            urlCount = URLFrp + 'contracts/count?' + searchBy + '=' + valueSearchBy
            searchQuery = '&'+ searchBy +'=' + valueSearchBy


        print("////////////")
        print(urlCount)
        print( 'contracts/?offset=' + str(paginationStart) + '&limit=' + str(paginationStep) + searchQuery)


        countAmount = requests.get( urlCount ).json()['count']
        queryStr = 'contracts/?offset=' + str(paginationStart) + '&limit=' + str(paginationStep) + searchQuery
        url = URLFrp + queryStr


        r = requests.get( url) 
        dataRes = r.json() 
        
        return jsonify( { 'data' : dataRes, 'count' : countAmount} )




#Agrega contract
@app.route('/contracts/add', methods=['GET', 'POST'])
def contractsAdd():

    #Renderiza el template del formulario para agregar un proveedor
    if request.method == 'GET':
        
        return render_template( 'contracts/add.html', catalog='contracts', menu = general.menuContract )
    
    #Cuando termina de cargar la pagina el javascrip pide la lista de los proveedores
    else:
        data = request.get_json()

        dicData = { 
            'number'                     : data['number'                   ], 
            'title'                      : data['title'                    ], 
            'description'                : data['description'              ], 
            'provider'                   : data['provider'                 ], 
            'delivery_stage'             : data['delivery_stage'           ], 
            'initial_contracted_amount'  : data['initial_contracted_amount'], 
            'kickoff'                    : data['kickoff'                  ], 
            'ending'                     : data['ending'                   ], 
            'down_payment'               : data['down_payment'             ], 
            'down_payment_amount'        : data['down_payment_amount'      ], 
            'ext_agreement'              : data['ext_agreement'            ], 
            'ext_agreement_amount'       : data['ext_agreement_amount'     ], 
            'final_contracted_amount'    : data['final_contracted_amount'  ], 
            'total_amount_paid'          : data['total_amount_paid'        ], 
            'outstanding_down_payment'   : data['outstanding_down_payment' ], 
            "inceptor_uuid"              : "string"
        }

        dataJSON = json.dumps(dicData)
        print(dicData['title'])
        url = URLFrp + 'contracts/'
        r = requests.post( url, data=dataJSON)
        print(r)
        return jsonify( data = data )



#Edita contracs
@app.route('/contracts/edit/<int:provider_id>', methods=['GET', 'POST', 'DELETE'])
def contractsEdit(provider_id):

    #Renderiza el template del formulario para agregar un proveedor
    if request.method == 'GET':
        
        url = URLFrp + 'contracts/' + str(provider_id)
        r = requests.get( url) 
        reqJ = r.json()

        return render_template( 'contracts/edit.html', data = reqJ, catalog = 'contracts', menu = general.menuContract )
    
    #Cuando termina de cargar la pagina el javascrip pide la lista de los proveedores
    elif request.method == 'POST':
        data = request.get_json()
        
        idRegister = data['id']

        dicData = { 
            'number'                     : data['number'                  ], 
            'title'                      : data['title'                    ], 
            'description'                : data['description'              ], 
            'provider'                   : data['provider'                 ], 
            'delivery_stage'             : data['delivery_stage'           ], 
            'initial_contracted_amount'  : data['initial_contracted_amount'], 
            'kickoff'                    : data['kickoff'                  ], 
            'ending'                     : data['ending'                   ], 
            'down_payment'               : data['down_payment'             ], 
            'down_payment_amount'        : data['down_payment_amount'      ], 
            'ext_agreement'              : data['ext_agreement'            ], 
            'ext_agreement_amount'       : data['ext_agreement_amount'     ], 
            'final_contracted_amount'    : data['final_contracted_amount'  ], 
            'total_amount_paid'          : data['total_amount_paid'        ], 
            'outstanding_down_payment'   : data['outstanding_down_payment' ], 
            "inceptor_uuid"              : "string"
        }

        dataJSON = json.dumps(dicData)

        url = URLFrp + 'contracts/' + idRegister
        r = requests.put( url, data=dataJSON)

        return jsonify( {'success':'success'} )

    elif request.method == 'DELETE':
        url = URLFrp + 'contracts/' + str(provider_id)
        r = requests.delete( url )
        return jsonify( 'yes' )







if __name__ == '__main__':
	app.run(host='0.0.0.0', port=80)
