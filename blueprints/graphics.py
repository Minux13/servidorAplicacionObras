import os, json, requests
from flask import Flask, url_for, render_template, request, jsonify, Blueprint


from general import URLFrp, menuGraphics

bp = Blueprint('graphics', __name__,
                        template_folder='templates')


@bp.route('/graphics', methods=['GET', 'POST'])
def graphicsList():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        
        departments = requests.get( URLFrp + 'catalogues/departments' ).json()

        return render_template( 'graphics/index.html', 
                                catalog='graphics', 
                                menu = menuGraphics, 
                                departments = departments, 
                                urlLink= '/projects_follow_ups/' )
    
    else:
        data = request.get_json()
        
        #Cuando la dependencia es 0 devuelve sin todos los proyectos
        #strDepQuery = '?department=' + str(dependency) if dependency != '0' else ''

        #queryStr = 'projects/stages' + strDepQuery
        #url = URLFrp + queryStr
        #r = requests.get( url) 
        #dataRes = r.json() 
        
        empty_follow_ups = '?empty_follow_ups=0'
        limit        = '&limit=1000000'
        department   = '&department=' + data['department'] if data['department'] != '' else ''
        check_stage  = '&check_stage=' + data['check_stage'] if data['check_stage'] != '' else ''
        city         = '&city=' + data['city'] if data['city'] != '' else ''
        year         = '&year=' + data['year'] if data['year'] != '' else ''
        funding      = '&funding=' + data['funding'] if data['funding'] != '' else ''
        program      = '&program=' + data['program'] if data['program'] != '' else ''
        adjudication = '&adjudication=' + data['adjudication'] if data['adjudication'] != '' else ''
        print(data['department'])
        url = URLFrp + 'projects/with_follow_up' + empty_follow_ups + limit + department + check_stage + city + funding
        print(url)
        r = requests.get( url) 
        dataRes = r.json() 
        
        return jsonify( { 'data' : dataRes } )


@bp.route('/projects_follow_ups/<int:deparment_id>/<int:status_id>', methods=['GET', 'POST'])
def projectsFollowUps(deparment_id, status_id):

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        
        checkStates = requests.get( URLFrp + 'catalogues/check_stages' ).json()

        return render_template( 'graphics/list.html', 
                                catalog='projects_follow_ups', 
                                menu = menuGraphics, 
                                dependencyId=deparment_id, 
                                statusId= status_id,
                                pagePrev = '/graphics',
                                checkStates = checkStates,
                                urlLink = '/project_detail/'   )
    
    else:
        data = request.get_json()
        
        paginationStart     = data['paginationStart']

        
        dependency = '' if deparment_id == 0 else '&department=' + str(deparment_id)

        #queryStr = 'projects/with_follow_up?check_stage=' + str(status_id) + '&department=' + str(deparment_id) + '&offset=' + str(1000000)
        queryStr = 'projects/with_follow_up?check_stage=' + str(status_id) + dependency + '&limit=' + str(10000000)
        url = URLFrp + queryStr
        r = requests.get( url) 
        dataRes = r.json() 
        
        return jsonify( { 'data' : dataRes } )


@bp.route('/project_detail/<int:project_id>', methods=['GET', 'POST'])
def projectDetail(project_id):

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':

        checkStates = requests.get( URLFrp + 'catalogues/check_stages' ).json()

        return render_template( 'graphics/detail.html', 
                                catalog='/project_detail/', 
                                menu = menuGraphics, 
                                projectId= project_id,
                                pagePrevPrev = '/graphics',
                                pagePrev = '/projects_follow_ups/',
                                pathUrl = URLFrp + 'attachments/',
                                checkStates = checkStates  )
    
    else:

        queryStr = 'projects/with_follow_up?project=' + str(project_id)
        url = URLFrp + queryStr
        r = requests.get( url) 
        dataRes = r.json() 
        
        contractId = dataRes[0]['contract_id']

        contracts = requests.get( URLFrp + 'contracts/' + str(contractId) ).json()
        provider = requests.get( URLFrp + 'providers/' + str(contracts['provider']) ).json()
       
        return jsonify( { 'data' : dataRes, 'contract': contracts, 'provider': provider } )


