import os, json, requests
from flask import Flask, url_for, render_template, request, jsonify

import general

app = Flask(__name__)

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
        
        paginationStart     = data['paginationStart']
        paginationStep      = data['paginationStep']
        paginationBy        = data['by']
        paginationOrder     = data['order']
        searchBy            = data['searchBy']
        valueSearchBy       = data['valueSearchBy']

        #?offset=9&limit=10&order_by=id&order=ASC


        if searchBy == '':
            urlCount = URLFrp + 'providers/count'
            searchQuery = '' 
        else:
            urlCount = URLFrp + 'providers/count?' + searchBy + '=' + valueSearchBy
            searchQuery = '&'+ searchBy +'=' + valueSearchBy


        countAmount = requests.get( urlCount ).json()['count']
        queryStr = 'providers/?offset=' + str(paginationStart) + '&limit=' + str(paginationStep) + searchQuery
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

        return jsonify( {'status_code': r.status_code } )



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

        return jsonify( {'status_code': r.status_code } )

    elif request.method == 'DELETE':
        url = URLFrp + 'providers/' + str(provider_id)
        r = requests.delete( url )
        return jsonify( {'status_code': r.status_code } )






########   Contrato   #######3

#Paginacion
@app.route('/contracts', methods=['GET', 'POST'])
def contracts():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        
        return render_template( 'contracts/index.html', catalog='contracts', menu = general.menuContract, title='Contratos' )
    
    else:
        data = request.get_json()
        
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
        
        
        #Obtiene todos providers para el select
        urlCountProviders = URLFrp + 'providers/count'
        countAmountProviders = requests.get( urlCountProviders ).json()['count']

        queryStrProviders = 'providers/?offset=0&limit=' + str(countAmountProviders)
        urlProviders = URLFrp + queryStrProviders

        rProviders = requests.get( urlProviders ) 
        providers = rProviders.json() 




        return render_template( 'contracts/add.html', catalog='contracts', menu = general.menuContract, providers =providers )
    
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

        url = URLFrp + 'contracts/'
        r = requests.post( url, data=dataJSON)

        return jsonify( {'status_code': r.status_code } )



#Edita contracs
@app.route('/contracts/edit/<int:provider_id>', methods=['GET', 'POST', 'DELETE'])
def contractsEdit(provider_id):

    #Renderiza el template del formulario para agregar un proveedor
    if request.method == 'GET':
        
        url = URLFrp + 'contracts/' + str(provider_id)
        r = requests.get( url) 
        reqJ = r.json()

        #Obtiene todos providers
        urlCountProviders = URLFrp + 'providers/count'
        countAmountProviders = requests.get( urlCountProviders ).json()['count']

        queryStrProviders = 'providers/?offset=0&limit=' + str(countAmountProviders)
        urlProviders = URLFrp + queryStrProviders

        rProviders = requests.get( urlProviders ) 
        providers = rProviders.json() 
        
        

        return render_template( 'contracts/edit.html', data = reqJ, catalog = 'contracts', menu = general.menuContract, providers = providers )
    
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

        return jsonify( {'status_code': r.status_code} )

    elif request.method == 'DELETE':
        url = URLFrp + 'contracts/' + str(provider_id)
        r = requests.delete( url )
        return jsonify( {'status_code': r.status_code } )






########   Project   #######3

#Paginacion
@app.route('/projects', methods=['GET', 'POST'])
def projects():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        
        return render_template( 'projects/index.html', catalog='projects', menu = general.menuProject, title='Obras' )
    
    else:
        data = request.get_json()
        
        paginationStart     = data['paginationStart']
        paginationStep      = data['paginationStep']
        paginationBy        = data['by']
        paginationOrder     = data['order']
        searchBy            = data['searchBy']
        valueSearchBy       = data['valueSearchBy']
        

        if searchBy == '':
            urlCount = URLFrp + 'projects/count'
            searchQuery = '' 
        else:
            urlCount = URLFrp + 'projects/count?' + searchBy + '=' + valueSearchBy
            searchQuery = '&'+ searchBy +'=' + valueSearchBy


        countAmount = requests.get( urlCount ).json()['count']
        queryStr = 'projects/?offset=' + str(paginationStart) + '&limit=' + str(paginationStep) + searchQuery
        url = URLFrp + queryStr


        r = requests.get( url) 
        dataRes = r.json() 
        
        return jsonify( { 'data' : dataRes, 'count' : countAmount} )



#Agrega project
@app.route('/projects/add', methods=['GET', 'POST'])
def projectsAdd():

    #Renderiza el template del formulario para agregar un 
    if request.method == 'GET':
        
        #Obtiene todos contracts para el select
        urlCountContracts = URLFrp + 'contracts/count'
        countAmountContracts = requests.get( urlCountContracts ).json()['count']

        queryStrContracts = 'contracts/?offset=0&limit=' + str(countAmountContracts)
        urlContracts = URLFrp + queryStrContracts

        rContracts = requests.get( urlContracts ) 
        contracts = rContracts.json() 
        

        return render_template( 'projects/add.html', catalog='projects', menu = general.menuProject, contracts = contracts )
    

    #Cuando termina de cargar la pagina el javascrip pide la lista de los proveedores
    else:
        data = request.get_json()

        dicData = { 
            'title'         : data['title'         ], 
            'description'   : data['description'   ], 
            'city'          : data['city'          ], 
            'category'      : data['category'      ], 
            'department'    : data['department'    ], 
            'budget'        : data['budget'        ], 
            'contract'      : data['contract'      ], 
            'planed_kickoff': data['planed_kickoff'], 
            'planed_ending' : data['planed_ending' ], 
            'inceptor_uuid' : data['inceptor_uuid' ], 
        }

        dataJSON = json.dumps(dicData)

        url = URLFrp + 'projects/'
        r = requests.post( url, data=dataJSON)

        return jsonify( {'status_code': r.status_code } )



#Edita projects
@app.route('/projects/edit/<int:provider_id>', methods=['GET', 'POST', 'DELETE'])
def projectsEdit(provider_id):

    #Renderiza el template del formulario para agregar un proveedor
    if request.method == 'GET':
        
        url = URLFrp + 'projects/' + str(provider_id)
        r = requests.get( url) 
        reqJ = r.json()

        #Obtiene todos contracts para el select
        urlCountContracts = URLFrp + 'contracts/count'
        countAmountContracts = requests.get( urlCountContracts ).json()['count']

        queryStrContracts = 'contracts/?offset=0&limit=' + str(countAmountContracts)
        urlContracts = URLFrp + queryStrContracts

        rContracts = requests.get( urlContracts ) 
        contracts = rContracts.json() 
        
        return render_template( 'projects/edit.html', data = reqJ, catalog = 'projects', menu = general.menuProject, contracts = contracts )
    
    #Cuando termina de cargar la pagina el javascrip pide la lista de los proveedores
    elif request.method == 'POST':
        data = request.get_json()
        
        idRegister = data['id']

        dicData = { 
            'title'         : data['title'         ], 
            'description'   : data['description'   ], 
            'city'          : data['city'          ], 
            'category'      : data['category'      ], 
            'department'    : data['department'    ], 
            'budget'        : data['budget'        ], 
            'contract'      : data['contract'      ], 
            'planed_kickoff': data['planed_kickoff'], 
            'planed_ending' : data['planed_ending' ], 
            'inceptor_uuid' : data['inceptor_uuid' ], 
        }

        dataJSON = json.dumps(dicData)

        url = URLFrp + 'projects/' + idRegister
        r = requests.put( url, data=dataJSON)

        return jsonify( {'status_code': r.status_code} )

    elif request.method == 'DELETE':
        url = URLFrp + 'projects/' + str(provider_id)
        r = requests.delete( url )
        return jsonify( {'status_code': r.status_code } )




########   Follow Ups   #######3

#Paginacion
@app.route('/followups', methods=['GET', 'POST'])
def followups():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        
        return render_template( 'followups/index.html', catalog='followups', menu = general.menuFollowUps, title='Avance de Obras' )
    
    else:
        data = request.get_json()
        
        paginationStart     = data['paginationStart']
        paginationStep      = data['paginationStep']
        paginationBy        = data['by']
        paginationOrder     = data['order']
        searchBy            = data['searchBy']
        valueSearchBy       = data['valueSearchBy']
        

        if searchBy == '':
            urlCount = URLFrp + 'projects/count'
            searchQuery = '' 
        else:
            urlCount = URLFrp + 'projects/count?' + searchBy + '=' + valueSearchBy
            searchQuery = '&'+ searchBy +'=' + valueSearchBy


        countAmount = requests.get( urlCount ).json()['count']
        queryStr = 'projects/?offset=' + str(paginationStart) + '&limit=' + str(paginationStep) + searchQuery
        url = URLFrp + queryStr


        r = requests.get( url) 
        dataRes = r.json() 
        
        return jsonify( { 'data' : dataRes, 'count' : countAmount} )


#Agrega followups
@app.route('/followups/add', methods=['GET', 'POST'])
def followupsAdd():

    #Renderiza el template del formulario para agregar un 
    if request.method == 'GET':
        
        #Obtiene todos projects para el select
        urlCountProjects = URLFrp + 'projects/count'
        countAmountProjects = requests.get( urlCountProjects ).json()['count']

        queryStrProjects = 'projects/?offset=0&limit=' + str(countAmountProjects)
        urlProjects = URLFrp + queryStrProjects

        rProjects = requests.get( urlProjects ) 
        projects = rProjects.json() 
        

        return render_template( 'followups/add.html', catalog='followups', menu = general.menuFollowUps, projects = projects )
    

#Agrega followups
@app.route('/followups/addd', methods=['GET', 'POST'])
def followupsAddd():

    #Renderiza el template del formulario para agregar un 
    if request.method == 'GET':
        

        return render_template( 'followups/addd.html', catalog='followups', menu = general.menuFollowUps, projects = projects )
    




#Edita followups
@app.route('/followups/edit/<int:provider_id>', methods=['GET', 'POST', 'DELETE'])
def followupsEdit(provider_id):

    #Renderiza el template del formulario para agregar un proveedor
    if request.method == 'GET':
        
        url = URLFrp + 'projects/' + str( 3 )
        r = requests.get( url) 
        reqJ = r.json()

        #return render_template( 'followups/edit2.html', data = reqJ, catalog = 'projects', menu = general.menuProject, contracts = contracts )
        return render_template( 'followups/edit2.html', data = reqJ, catalog = 'followups', menu = general.menuFollowUps )
    
    """
    #Cuando termina de cargar la pagina el javascrip pide la lista de los proveedores
    elif request.method == 'POST':
        data = request.get_json()
        
        idRegister = data['id']

        dicData = { 
            'title'         : data['title'         ], 
            'description'   : data['description'   ], 
            'city'          : data['city'          ], 
            'category'      : data['category'      ], 
            'department'    : data['department'    ], 
            'budget'        : data['budget'        ], 
            'contract'      : data['contract'      ], 
            'planed_kickoff': data['planed_kickoff'], 
            'planed_ending' : data['planed_ending' ], 
            'inceptor_uuid' : data['inceptor_uuid' ], 
        }

        dataJSON = json.dumps(dicData)

        url = URLFrp + 'projects/' + idRegister
        r = requests.put( url, data=dataJSON)

        return jsonify( {'status_code': r.status_code} )

    elif request.method == 'DELETE':
        url = URLFrp + 'projects/' + str(provider_id)
        r = requests.delete( url )
        return jsonify( {'status_code': r.status_code } )
    """




if __name__ == '__main__':
    app.run(port=8081, host="0.0.0.0", debug=True)
    #app.run(host='0.0.0.0', port=80)
