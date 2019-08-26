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
        data = request.get_json()
        
        paginationStart = str(data['paginationStart'])
        departmentId    = str(data['department'])
        statusId        = str(data['status'])
        cityId          = str(data['city'])
        startDate       = str(data['startDate'])
        endDate         = str(data['endDate'])
        providerId      = str(data['provider'])
        fundingId       = str(data['funding'])
        programId       = str(data['program'])
        adjudicationId  = str(data['adjudication'])

        empty_follow_ups = '?empty_follow_ups=0'
        offset       = '&offset='               + paginationStart
        department   = '&department='           + departmentId   if departmentId     != '' else ''
        
        check_stage = '&check_stage='       + statusId       if statusId         != '' else ''
        if "," in statusId:
            check_stage = ''
            idsS = statusId.split(',')
            for i in idsS :
                thisCheckStage = '&check_stage=' + i
                check_stage += thisCheckStage
        

        city         = '&city='                 + cityId         if cityId           != '' else ''
        startDate    = '&contract_start_date='  + startDate      if startDate        != '' else ''
        endDate      = '&contract_end_date='    + endDate        if endDate          != '' else ''
        provider     = '&provider='             + providerId     if providerId       != '' else ''
        funding      = '&funding='              + fundingId      if fundingId        != '' else ''
        program      = '&program='              + programId      if programId        != '' else ''
        adjudication = '&adjudication='         + adjudicationId if adjudicationId   != '' else ''

        url = URLFrp + 'projects/with_follow_up' + empty_follow_ups + offset + department + check_stage + city + startDate + endDate + provider + funding + program + adjudication
        urlCount = URLFrp + 'projects/with_follow_up/count' + empty_follow_ups + offset + department + check_stage + city + startDate + endDate + provider + funding + program + adjudication
        r = requests.get( url) 
        rC = requests.get( urlCount) 
        dataRes = r.json() 
        
        return jsonify( { 'data' : dataRes, 'count' : rC.json() } )


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
