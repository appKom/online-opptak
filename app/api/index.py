from sanic import Sanic
from sanic.response import json
app = Sanic()
 
 
@app.route('/algorithm')
async def index(request, path=""):
    return json({'hello': "world"})