import time
import inspect
from functools import wraps
from flask import Flask, request

app = Flask(__name__)


@app.route('/time')
def get_current_time():
    return {'time': time.time()}


characters = {i + 1: x for i,x in enumerate(
    [
        {'name': 'Kāhu',
         'campaign': 'brinkwood',
         'description': 'trouble'},
        {'name': 'Bob',
         'campaign': 'cafe',
         'description': 'boring'},
        {'name': 'Katy',
         'campaign': 'cafe',
         'description': 'short for bob'},
    ]
)}

campaigns = {i + 1: x for i,x in enumerate(
[
    {'name': 'Cozy Cafe',
        'diefaces': ['race', 'class', 'feat', 'why']
        },
    {'name': 'Brinkwood',
        'diefaces': ['before', 'now', 'also', 'why']
        },
]
)}


def query_params(f):
    """
    Decorator that will read the query parameters for the request.
    The names are the names that are mapped in the function.
    """
    parameter_names = inspect.getfullargspec(f).args

    @wraps(f)
    def logic(*args, **kw):
        params = dict(kw)

        for parameter_name in parameter_names:
            if parameter_name in request.args:
                params[parameter_name] = request.args.get(parameter_name)

        return f(**params)

    return logic


@app.route('/characterlist')
@query_params
def get_character_list(campaign=None):
    listFields = ['name', 'campaign', 'description']

    charlist = []
    for charId, character in characters.items():
        if campaign:
            if character['campaign'] != campaign:
                continue

        thinC = {k: character.get(k) for k in listFields}
        thinC['id'] = charId

        charlist.append(thinC)

    return charlist


@app.route('/character/<int:id>', methods=["GET"])
def get_character(id):
    retval = characters[id]
    retval['id'] = id
    return retval


def newCharacterID():
    return max(characters.keys()) + 1


@app.route('/character', methods=["POST"])
def post_character():
    print(f'data {request.data}')
    print(f'json {request.json}')

    name = request.json.get('name', {}).get('text')
    if not name:
        return {}

    newID = newCharacterID()
    characters[newID] = {'id': newID,
                         'name': name,
                         'campaign': None,
                         'description': None}
    print(characters[newID])
    # TODO actually store stuff somewhere
    return characters[newID]


@app.route('/campaigns')
def get_campaigns():
    retval = []
    for c, campaign in campaigns.items():
        campaign['id'] = c
        retval.append(campaign)
    return retval
