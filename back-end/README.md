# Initial Project Setup

## REST API

This initial working app implements:

| Method   | Route       | Parameters  | Out  | Perms | Comments |
|---       |---          |---          |---   |---    |---       |
| `GET`    | `/version`  | `sleep`?    | dict | *any* | application setup, with delay |
| `GET`    | `/stats`    |             | dict | *adm* | show query calls |
| `GET`    | `/who-am-i` |             | str  | *all* | show authenticated user |
| `POST`   | `/register` | `login`<br>`password` | | *any* | *201* register a new user<br>*400* for params<br>*409* if exists |
| `DELETE` | `/users/<login>` | | | *adm* | *204* delete user *(tests only)*<br>*404* if not exists |

Note: the `/version` route should be restricted.

## Files

The following files are available in the `back-end` directory:

- [`Makefile`](Makefile) which wondefully automates some tasks by running `make some-task`.
- [`local.mk`](local.mk) local configuration, set `APP` for the application name.
- [`deploy.mk`](deploy.mk) deployment rules.
- [`app.py`](app.py) a marvellous [*Flask*](https://flask.palletsprojects.com/) application which gives the time.
  The application uses [*FlaskSimpleAuth*](https://pypi.org/project/flasksimpleauth/), a Flask wrapper which
  provides additional services such as authentication, authorization, parameter managements and other utils.
- [`local.conf`](local.conf) app debug configuration with a local [*Postgres*](https://postgresql.org/).
- [`server.conf`](server.conf) app development configuration on `mobapp.minesparis.psl.eu`.
- [`auth.py`](auth.py) authentication and authorization helpers.
- [`database.py`](database.py) database bridge based on [*anodb*](https://pypi.org/project/anodb/),
  [*aiosql*](https://pypi.org/project/aiosql/) and [*psycopg*](https://pypi.org/project/psycopg/).
- [`queries.sql`](queries.sql) SQL queries for the aiosql wrapper.
- [`create.sql`](create.sql) create application schema.
- [`data.sql`](data.sql) insert initial test data (2 tests users).
- [`truncate.sql`](truncate.sql) cleanup schema contents.
- [`drop.sql`](drop.sql) drop application schema.
- [`test.py`](test.py) [*pytest*](https://docs.pytest.org/) script.
- [`pass2csv.py`](pass2csv.py) génération des comptes à partir de `test_users.in`

## Useful Make Targets

The [`Makefile`](Makefile) automates some common tasks.
Check that you understand how they work.

- cleanup generated files, stop everything:

  ```sh
  make clean
  ```

- start app in verbose dev mode on local port 5000, and check that it works from another terminal:

  ```sh
  # first terminal, ctrl-c to stop showing logs, show again with "make log"
  make log

  # second terminal
  curl -i -X GET http://0.0.0.0:5000/version
  # see other terminal for traces of the request!
  ```

  In developement, it is useful to have a separate terminal which shows
  continuously the contents of the log file and think to look at it when
  things go wrong… and to tkink to look at it from time to time!

- stop running app:

  ```sh
  make stop       # soft version
  make full-stop  # hard version when things go wrong…
  ```

- run tests: all, type checking (`mypy`), style checking (`flake8` or `black`)
  or with a run check against a postgres database (`pytest`)…
  ```sh
  make check           # run all available tests, that is:
  make check.mypy      # syntax and type checking
  make check.flake8    # style checking
  make check.pytest    # pytest run against Postgres
  ```

- send application to remote server
  ```sh
  make deploy
  ```

## Deployment (only for information)

This section describes what the admin must do to create the deployed environment.

### Database on `pagode`

Application specific role and database:

```sql
CREATE ROLE projet WITH
  LOGIN ENCRYPTED PASSWORD '<password>'
  USER fcoelho, cmedrala
  CONNECTION LIMIT 3;
CREATE DATABASE projet WITH
  OWNER projet
  CONNECTION LIMIT 3;
\c projet
ALTER DEFAULT PRIVILEGES IN SCHEMA PUBLIC
  GRANT ALL PRIVILEGES ON TABLES TO pg_database_owner;
ALTER DEFAULT PRIVILEGES IN SCHEMA PUBLIC
  GRANT ALL PRIVILEGES ON ROUTINES TO pg_database_owner;
ALTER DEFAULT PRIVILEGES IN SCHEMA PUBLIC
  GRANT ALL PRIVILEGES ON SEQUENCES TO pg_database_owner;
```

Allow connections from web server `mobapp`:

```
# File `pg_hba.conf`
hostssl projet projet 77.158.173.100/32 scram-sha-256
```

### Web Server on `mobapp`

As an admin sudoer, create a `projet` user:

```shell
sudo adduser --disabled-password projet
sudo su projet mkdir .ssh app conf www
# edit ~projet/.ssh/authorized_keys
# edit ~projet/.pgpass: pagode:5432:projet:projet:<password>
# fix perms
```

Setup and activate Apache httpd configuration:

```
# File "conf/mobapp-httpd.conf"
Use Project projet
```

As `projet` on `mobapp`:

```shell
# check working connection
psql -h pagode -d projet -c "SELECT NOW();"
```
