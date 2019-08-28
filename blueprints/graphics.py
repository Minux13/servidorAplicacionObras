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
        providers = requests.get( URLFrp + 'providers/?limit=10000000&order_by=title' ).json()

        return render_template( 'graphics/index.html', 
                                catalog='graphics', 
                                menu = menuGraphics, 
                                departments = departments, 
                                providers = providers,
                                urlLink= '/projects_follow_ups' )
    
    else:
        url = URLFrp + request.query_string.decode("utf-8")

        r = requests.get( url) 
        dataRes = r.json() 
        
        return jsonify( { 'data' : dataRes } )


@bp.route('/projects_follow_ups', methods=['GET', 'POST'])
def projectsFollowUps():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        
        return render_template( 'graphics/list.html', 
                                catalog        ='projects_follow_ups', 
                                menu           = menuGraphics, 
                                pagePrev       = '/graphics',
                                urlLink        = '/project_detail/'   )
    
    else:
        url = URLFrp + request.query_string.decode("utf-8")

        #url = URLFrp + 'projects/with_follow_up' + empty_follow_ups + offset + department + check_stage + city + startDate + endDate + provider + funding + program + adjudication
        #print('\n\n\n\n')
        #print(url)
        #print('\n\n\n\n')
        #urlCount = URLFrp + 'projects/with_follow_up/count' + empty_follow_ups + offset + department + check_stage + city + startDate + endDate + provider + funding + program + adjudication
        #urlCount = URLFrp + 'projects/with_follow_up/count?' + request.query_string.decode("utf-8")
        r = requests.get( url) 
        #rC = requests.get( urlCount) 
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




@bp.route('/demo_grafica', methods=['GET'])
def demoGrafica():
    return render_template( 'grafica.html' )
    
  
@bp.route('/demo_seguimiento', methods=['GET'])
def demoSeguimiento():
    return render_template( 'seguimiento.html' )

@bp.route('/ventas', methods=['GET'])
def ventas():
    return render_template( 'ventas.html' )
