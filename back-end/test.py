#! /usr/bin/env python3
#
# Test against a running local server, including expected failures.
#
# These tests are not internal flask tests which shortcut part of the machinery,
# but actually access the server through HTTP requests, so that it could be run
# against a remote production server.
#
# The test assumes some initial data and resets the database to the initial
# state, so that it can be run several times if no failure occurs.
#
# The test could initialize some database, but I also want to use it against a
# deployed version and differing databases, so keep it light.
#


import pytest  # type: ignore
import json
import re
import os
from typing import Dict, Union, Tuple, Optional

import logging
log = logging.getLogger(__name__)

# local flask server test by default
URL = os.environ.get("APP_URL", "http://0.0.0.0:5000")

# real (or fake) authentication
ADMIN, NOADM = "calvin", "hobbes"

# login -> password
AUTH: Dict[str, Union[str, None]] = {}

# initialize passwords from the environment
if "APP_AUTH" in os.environ:
    # we are running with a real server with authentication
    for up in os.environ["APP_AUTH"].split(","):
        user, pw = up.split(":", 1)
        AUTH[user] = pw
    real_auth = True
else:
    # else we assume test users
    AUTH[ADMIN] = None
    AUTH[NOADM] = None

# reuse connections… otherwise tests are very slow
from requests import Session
requests = Session()

# authentication tokens
TOKEN: Dict[str, str] = {}

# add a json or http request parameter
def add_param(kwargs, key, val):
    if "json" in kwargs:
        kwargs["json"][key] = val
    elif "data" in kwargs:
        kwargs["data"][key] = val
    else:
        kwargs["data"] = {key: val}

# authentication management *with parameters*
def set_auth(login, kwargs):
    if login is None:
        return  # not needed
    # use token if available
    elif login in TOKEN:
        assert "headers" not in kwargs
        kwargs["headers"] = {"Authorization": "Bearer " + TOKEN[login]}
    else:
        assert login in AUTH
        kwargs["auth"] = (login, AUTH[login])

#
# Convenient function to send an http request and check the result with a re
#
# Note: the "login" parameter special handling allows to run auth tests on a
# local server without actual authentication, or with basic authentication if
# the APP_AUTH environment variable provides the needed passwords.
# By default, ADMIN is assumed, use None to skip auth.
#
# check_api(method: str,         # "GET", "POST", "PUT", "PATCH", "DELETE"
#           path: str,           # "/some/url"
#           status: int,         # 200, 201, 204, 400, 401, 403, 404…
#           content: str,        # regexpr to match: r"\[.*\]", r"calvin"…
#           login: str,          # auth: login=ADMIN (defaut), WRITE or READ
#           data: Dict[str,str], # http parameters: data={"id": "calvin, …}
#           json: Dict[str,str]) # json parameters: json={"id": "hobbes", …}
#
# Examples:
#
#    check_api("PUT", "/store", 405)
#    check_api("GET", "/store", 200, r"\"hobbes\"")
#    check_api("POST", "/store", 201, data={"key": "Roméo", "val": "Juliette"})
#    check_api("POST", "/store", 201, login=ADMIN, json={"key": "Roméo", "val": "Juliette"})
#    check_api("DELETE", "/store", 204)
#
#
# The functions return the result of the request, available for further
# processing with: r.status_code, r.text, r.json()…
#
def check_api(method: str, path: str, status: int, content: Optional[str] = None,
              login: str = ADMIN, **kwargs):
    # work around Werkzeug inability to handle authentication transparently
    auth: Optional[Tuple[str, str]] = None
    if login is not None:
        # real http server which handles authentication
        if login in AUTH and isinstance(AUTH[login], str) and AUTH[login] is not None:
            pwd: str = AUTH[login]  # type: ignore
            auth = (login, pwd)
    else:
        auth = None
    r = requests.request(method, URL + path, auth=auth, **kwargs)  # type: ignore
    if r.status_code != status:
        log.error(f"{method} {path} bad status {r.status_code}: {r.text}")
    assert r.status_code == status
    if content is not None:
        assert re.search(content, r.text, re.DOTALL) is not None
    return r

# get version information
VERSION = check_api("GET", "/version", 200, login=ADMIN).json()

# sanity check
# def test_sanity():
#     assert re.match(r"https?://", URL)
#     assert ADMIN in AUTH
#     assert NOADM in AUTH
#     assert isinstance(VERSION, dict)

# def test_who_am_i():
#     check_api("GET", "/who-am-i", 401, login=None)
#     check_api("GET", "/who-am-i", 200, ADMIN, login=ADMIN)
#     check_api("GET", "/who-am-i", 200, NOADM, login=NOADM)
#     check_api("POST", "/who-am-i", 405, login=ADMIN)
#     check_api("PUT", "/who-am-i", 405, login=ADMIN)
#     check_api("PATCH", "/who-am-i", 405, login=ADMIN)
#     check_api("DELETE", "/who-am-i", 405, login=ADMIN)

# /login and keep tokens
def test_login():
    TOKEN[ADMIN] = check_api("GET", "/login", 200, login=ADMIN).json()
    assert f":{ADMIN}:" in TOKEN[ADMIN]
    TOKEN[NOADM] = check_api("GET", "/login", 200, login=NOADM).json()
    assert f":{NOADM}:" in TOKEN[NOADM]


# /register
def test_register():
    # register a new user
    user, pswd = "dyna-user", "dyna-user-pass-123"
    AUTH[user] = pswd
    # bad login with a space
    check_api("POST", "/register", 400, data={"login": "this is a bad login", "password": pswd}, login=None)
    # login too short
    check_api("POST", "/register", 400, data={"login": "x", "password": pswd}, login=None)
    # login already exists
    check_api("POST", "/register", 409, data={"login": "calvin", "password": "p"}, login=None)
    # missing "login" parameter
    check_api("POST", "/register", 400, data={"password": pswd}, login=None)
    # missing "password" parameter
    check_api("POST", "/register", 400, data={"login": user}, login=None)
    # password is too short
    check_api("POST", "/register", 400, json={"login": "hello", "password": ""}, login=None)
    # password is too simple
    # check_api("POST", "/register", 400, json={"login": "hello", "password": "world!"}, login=None)
    # at last one which is expected to work!
    check_api("POST", "/register", 201, data={"login": user, "password": pswd}, login=None)
    TOKEN[user] = check_api("GET", "/login", 200, r"^([^:]+:){3}[^:]+$", login=user).json()
    log.debug(f"TOKEN[{user} = {TOKEN[user]}")
    check_api("DELETE", f"/users/{user}", 204, login=ADMIN)
    del TOKEN[user]
    del AUTH[user]


# # /version
# def test_version():
#     # only GET is implemented
#     check_api("GET", "/version", 200, '"calvin"', login=ADMIN)
#     check_api("GET", "/version", 200, '"hobbes"', login=NOADM)
#     check_api("GET", "/version", 200, r"null", login=None)
#     check_api("POST", "/version", 405)
#     check_api("DELETE", "/version", 405)
#     check_api("PUT", "/version", 405)
#     check_api("PATCH", "/version", 405)


# # /stats
# def test_stats():
#     check_api("GET", "/stats", 401, login=None)
#     check_api("GET", "/stats", 200, r"[0-9]", login=ADMIN)
#     check_api("GET", "/stats", 403, login=NOADM)
#     check_api("POST", "/stats", 405, login=ADMIN)
#     check_api("PUT", "/stats", 405, login=ADMIN)
#     check_api("PATCH", "/stats", 405, login=ADMIN)
#     check_api("DELETE", "/stats", 405, login=ADMIN)

# # /users
# def test_users():
#     check_api("GET", "/users", 401, login=None)
#     check_api("GET", "/users", 403, login=NOADM)
#     check_api("GET", "/users", 200, r"calvin", login=ADMIN)
#     check_api("POST", "/users", 405, login=ADMIN)
#     check_api("PUT", "/users", 405, login=ADMIN)
#     check_api("PATCH", "/users", 405, login=ADMIN)
#     check_api("DELETE", "/users", 405, login=ADMIN)

# # http -> https
# def test_redir():
#     global URL
#     if re.match(r"https://", URL):
#         URL, saved = URL.replace("https://", "http://"), URL
#         check_api("GET", "/version", 301, allow_redirects=False)
#         check_api("POST", "/version", 301, allow_redirects=False)
#         check_api("PUT", "/version", 301, allow_redirects=False)
#         check_api("PATCH", "/version", 301, allow_redirects=False)
#         check_api("DELETE", "/version", 301, allow_redirects=False)
#         URL = saved
#     else:
#         pytest.skip("cannot test ssl redir without ssl")
