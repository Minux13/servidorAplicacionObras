import os, json, requests
from flask import Flask, url_for, render_template, request, jsonify, Blueprint


from general import URLFrp

bp = Blueprint('graphics', __name__,
                        template_folder='templates')


@bp.route('/graphics', methods=['GET', 'POST'])
def graphicsList():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        

        return render_template( 'graphics/index.html' )
    
    else:
        url = URLFrp + request.query_string.decode("utf-8")

        r = requests.get( url) 
        dataRes = r.json() 
        
        return jsonify( { 'data' : dataRes } )


@bp.route('/projects_follow_ups', methods=['GET', 'POST'])
def projectsFollowUps():

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':
        
        return render_template( 'graphics/list.html' )
    
    else:
        url = URLFrp + request.query_string.decode("utf-8")

        r = requests.get( url) 
        dataRes = r.json() 
        
        return jsonify( { 'data' : dataRes } )


@bp.route('/project_detail/<int:project_id>', methods=['GET', 'POST'])
def projectDetail(project_id):

    #Renderiza el template de la lista de proveedores
    if request.method == 'GET':

        return render_template( 'graphics/detail.html' )
    
    else:

        url = URLFrp + request.query_string.decode("utf-8")
        r = requests.get( url) 
        dataRes = r.json() 
       
        return jsonify( { 'data' : dataRes } )




@bp.route('/demo_grafica', methods=['GET'])
def demoGrafica():
    return render_template( 'grafica.html' )
    
  
@bp.route('/demo_seguimiento', methods=['GET'])
def demoSeguimiento():
    return render_template( 'seguimiento.html' )

@bp.route('/ventas', methods=['GET'])
def ventas():
    return render_template( 'ventas.html' )
