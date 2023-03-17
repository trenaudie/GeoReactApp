import logging
import base64
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("test")

# local flask server test by default
from os import environ as ENV
from os.path import join
from json import dumps
NAME = ENV.get("APP_NAME", "kiva")
URL = ENV.get("APP_URL", "http://127.0.0.1:5000")

# real (or fake) authentication logins
ADMIN, WRITE, READ, READ2, NONE = "kiva", "calvin", "hobbes", "miss", "moe"

# login -> password for user authentification
AUTH = {}


# reuse connections, otherwise it is too slow…
import requests
import json

def check_api(
    method: str,
    path: str,
    status: int,
    login: str = ADMIN,
    password: str = "geoprob",
    **kwargs
):
    if path == "/":
        fullpath = URL
    else: 
        fullpath = join(URL, path)
    # perform the HTTP request


    data = {}
    for key,val in kwargs.items():
        data[key] = val

    headers = {'Content-Type': 'application/json'}


    #add credentials encoding to headers: 
    if login and password:
        auth_string = "{}:{}".format(login, password)
        auth_string_encoded = base64.b64encode(auth_string.encode()).decode()
        headers["Authorization"] = "Basic {}".format(auth_string_encoded)

    print('requesting to: ', fullpath, "with data: ", data, " and headers " , headers, " and credentials ", login, password)
    r = requests.request(method, fullpath, data = dumps(data), headers = headers)  # type: ignore

    # show error before aborting
    if r.status_code != status:
        log.error(f"bad {status} result: {r.status_code} {r.text}")
    if r.status_code==201:
        print(r.json())
    assert r.status_code == status






def test_register():
    check_api("POST","register", 201,  **{"login": "tanguy", "password": 'mathilde'} )


def test_login():
    check_api("GET","login", 201, **{"login": "calvin", "password": 'hobbes'} )
    check_api("GET","login", 400, **{"login": "wrong_login", "password": 'wrong_password'} )


def test_accident():
    check_api("GET","accident", 201,  **{"category_id": 1, "user_id": 1} )
    check_api("GET","accident", 201,  **{"category_id": 2, "user_id": 2} )
    check_api("GET","accident", 201,  **{"date": "2022-11-01 12:11:00" })
    check_api("POST","accident", 201,  **{"category": 4, "username": "tanguy", "description": "Road work ahead",  "date": "2022-11-01 12:11:00", "address": "6 rue saint-jacques"} )
    check_api("DELETE", "accident", 201, **{"id" : 1})