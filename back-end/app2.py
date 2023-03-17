from flask import Flask, render_template, request, url_for, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from sqlalchemy import select
from sqlalchemy import FLOAT
from datetime import datetime, timedelta  
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import logging


import base64

# create a logger object
logger = logging.getLogger('MainApp')

# set the level of the logger (default level is warning)
logger.setLevel(logging.DEBUG)

# create a file handler to write log messages to a file
file_handler = logging.FileHandler('myapp.log')

# create a stream handler to write log messages to the console
stream_handler = logging.StreamHandler()

# set the level of the handlers
file_handler.setLevel(logging.DEBUG)
stream_handler.setLevel(logging.DEBUG)

# create a formatter to format the log messages
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# set the formatter for the handlers
file_handler.setFormatter(formatter)
stream_handler.setFormatter(formatter)

# add the handlers to the logger
logger.addHandler(file_handler)
logger.addHandler(stream_handler)


logger.debug("This is a debug message")
logger.info("This is an info message")


db = SQLAlchemy()
login_manager = LoginManager()


app = Flask(__name__) 
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://mobapp_user:geoprob@localhost/geoprob"
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)


class User2(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=False)
    password = db.Column(db.String(30))

    def __repr__(self):
        return '<User %r>' % self.username


class Accident(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    desc = db.Column(db.Text, nullable=True)
    date_time= db.Column(db.DateTime, nullable=False,
        default=datetime.utcnow)
    latitude = db.Column(FLOAT, nullable=True, default = None)
    longitude = db.Column(FLOAT, nullable=True, default = None)
    address = db.Column(db.Text, nullable=True,default = None)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'),
        nullable=False)
    category = db.relationship('Category',
        backref=db.backref('posts', lazy=True))


    user_id = db.Column(db.Integer, db.ForeignKey('user2.id'), nullable=False)
    user = db.relationship('User2', backref=db.backref('accident', lazy=True))

    def __repr__(self):
        return '<Accident %r>' % self.category.name

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return '<Category %r>' % self.name


@login_manager.user_loader
def load_user(user_id):
    return User2.query.get(int(user_id))


@app.route('/', methods = ["get", "post"])
def index(): 
    print("inside index route")
    return "inside main / route"

@app.route('/register', methods=['POST'])
def register():
    logger.info("POST request to /register")
    if request.headers:
        logger.info("request headers found")
        auth_header = request.headers.get('Authorization', None)
        logger.info(request.headers)
        if auth_header:
            auth_parts = auth_header.split() # separate Basic username:password
            if auth_parts[0].lower() == 'basic':
                auth_decoded = base64.b64decode(auth_parts[1]).decode()
                username, password = auth_decoded.split(':') #separate username:password
                logger.info(f"Received register request, with credentials: {username}, {password}")
                user = User2(username=username, password=password)
                db.session.add(user)
                db.session.commit()
                return jsonify({"msg": "User created successfully"}), 201
    
    else:
        return jsonify({"msg": "Invalid request"}), 400

    
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.headers and request.method == 'GET':
        auth_header = request.headers.get('Authorization')
        logger.info(auth_header)
        if auth_header:
            auth_parts = auth_header.split() # separate Basic username:password
            if auth_parts[0].lower() == 'basic':
                auth_decoded = base64.b64decode(auth_parts[1]).decode()
                username, password = auth_decoded.split(':') #separate username:password
                logger.info(f"Received login request {request.data}, with credentials: {username}, {password}")
                #add login user logic
                user = User2.query.filter_by(username=username).first()
        if user and user.password == password:
            #get user id
            
            return jsonify({"msg": f"User successfully logged in with id {user.id}, username: {user.username}", "id": user.id}), 201
    return jsonify({"msg": "Invalid request"}), 400

@app.route('/logout')
@login_required
def logout():
    #add logout user logic
    return redirect(url_for('login'))


@app.route('/accident', methods=['GET', 'POST', 'DELETE'])
def accident():
    if request.method == 'GET':
        logger.info("GET request to /accident, request is json")

        if request.headers:
            logger.info("hellloooo")
            header = request.headers
            date= header.get("date", None) #query by date
            category = header.get("category", None) #query by category
            user_id = header.get("user_id", None) #query by user 
            username = header.get("username", None)


            ## RE DO THIS PART 

            if date: 
                logger.info(date)
                logger.info(date[-1])
                stmt = select(Accident) 
                #working with join
                #https://www.tutorialspoint.com/sqlalchemy/sqlalchemy_orm_working_with_joins.htm

            else:
                stmt = select(Accident)

            result = db.session.execute(stmt)
            resultJson = {} 
            for res_obj in result.scalars():
                logger.info("res_obj")
                res_json = {
                    "user": res_obj.user_id,
                    "category": res_obj.category.id,
                    "date": res_obj.date_time,
                    "latitude" : res_obj.latitude,
                    "longitude": res_obj.longitude
                    }
                if hasattr(res_obj,"address"):
                    res_json['address'] = res_obj.address
                if hasattr(res_obj,"desc"):
                    res_json['desc'] = res_obj.desc
                if hasattr(res_obj,'coordinates'):
                    logger.info(type(res_obj.coordinates))
                    res_json['coordinates'] = str(res_obj.coordinates)
                resultJson[res_obj.id] = res_json

            logger.info(f"result : {resultJson}")
            return resultJson,201
    if request.method == "POST":
        #category {1: Vandalism, 2: Police, 3: Blocked Street, 4: Construction Work, 5: Car Crash, 6: Traffic}
        logger.info("Post request for route /accident")
        
        if request.is_json:
            logger.info("POST is json")
            params = request.get_json()
            accident_params = {}
            if params.get("date"):
                accident_params['date_time'] = datetime.strptime(params.get("date"), "%Y-%m-%d %H:%M:%S")
            accident_params['category_id'] = params.get("category", None)
            coords = params.get("coords", None)
            if coords: 
                accident_params['latitude'] = coords['latitude']
                accident_params['longitude'] = coords['longitude']
                logger.info(accident_params['latitude'])
                logger.info(accident_params['longitude'])
            accident_params['address'] = params.get("address", None)
            username =  params.get("username", None)
            if not username: 
                raise KeyError("No username found")
            if not params.get("user_id",None): #get from db
                stmt = select(User2).where(User2.username == username) 
                logger.info(f"fetched user id {db.session.execute(stmt).fetchall()[0][0].id}")
                user_id = db.session.execute(stmt).fetchall()[0][0].id
                accident_params['user_id'] = user_id
            accident_params['desc'] = params.get("description", None)
            accident_params = {k:v for (k,v) in accident_params.items() if v is not None}

            acc = Accident(**accident_params)
            db.session.add(acc)
            db.session.commit()

            return jsonify({"msg": "Added accident successfully"}), 201


        return jsonify({"msg": "Invalid request, POST not implemented yet"}), 400

    if request.method == "DELETE":
        logger.info("Request is indeed DELETE")
        headers = request.headers
        #uniquely identify the marker using longitude and latitude
        key = headers['id']
        print(f"{key=}")
        stmt = Accident.query.filter_by(id = key).first()
        db.session.delete(stmt)
        db.session.commit()
        return jsonify({"msg": "Deleted accident successfully"}), 201


with app.app_context():
    db.create_all()
    BaseUsers = []
    user1 = User2(username = 'calvin', password = 'hobbes')
    user0 = User2(username = 'tanguy', password = 'renaudie')
    BaseUsers= [user0, user1]


    category1 = Category(name = 'Road Problems')
    category2 = Category(name = "Construction Work")
    category3 = Category(name = "Street Furniture Vandalism")
    category4 = Category(name = "Bulky Items")
    category5 = Category(name = "Wrongly Parked Car")
    category6 = Category(name = "Waste Bins")
    BaseCategories = [category1,category2,category3,category4, category5,category6]

    #48.87 2.34
    accident1 = Accident(category_id = 4, user_id = 1, date_time = datetime.now(), latitude = 48.8419405, longitude = 2.3411208, desc = "Encombrants déposés devant la maison des Mines et des Ponts bloquant la circulation", address = '272 Rue Saint-Jacques, 75005 Paris, France')
    accident2 = Accident(category_id = 2, user_id = 2, date_time = datetime.now() - timedelta(1), latitude = 48.8639, longitude = 2.3633,  desc = "Travaux rénovation façade empêchant la circulation sur le trottoir", address = '24 Rue de Picardie, 75003 Paris, France')
    accident3 = Accident(category_id = 1, user_id = 1, date_time = datetime.now(), latitude = 48.8584, longitude = 2.2945, desc = "Nid de poule sur la route", address = '5 Avenue Anatole France, 75007 Paris, France')
    accident4 = Accident(category_id = 5, user_id = 2, date_time = datetime.now() - timedelta(1), latitude = 48.8696, longitude = 2.3129, desc = "Voiture en double file sur une piste cyclable", address = '44 Avenue Gabriel, 75008 Paris, France')
    accident5 = Accident(category_id = 4, user_id = 1, date_time = datetime.now(), latitude = 48.8530, longitude = 2.3498, desc = "Encombrants déposés sur la route devant Notre Dame", address = 'Notre Dame Cathedrale, Paris')
    accident6 = Accident(category_id = 2, user_id = 1, date_time = datetime.now(), latitude = 48.8649, longitude =2.3198, desc = "Travaux pour les jeux olympiques", address = 'Place de la Concorde, 75008 Paris, France.')
    accident7 = Accident(category_id = 1, user_id = 2, date_time = datetime.now(), latitude = 48.8539, longitude =2.3566, desc = "Endommagement de la chausée", address = "66 rue Saint-Louis en l'Île, 75004 Paris, France")
    accident8 = Accident(category_id = 6, user_id = 2, date_time = datetime.now(), latitude = 48.8561, longitude =2.3524, desc = "Poubelles renversées sur la route!", address = "Place de l'Hôtel de Ville, 75004 Paris, France")

    BaseAccidents = [accident1,accident2, accident3, accident4,accident5, accident6, accident7, accident8]


    for user in BaseUsers:
        if not User2.query.filter_by(username = user.username).first():
            db.session.add(user)

    for category in BaseCategories:
        if not Category.query.filter_by(name = category.name).first():
            db.session.add(category)

    for acc in BaseAccidents:
        if not Accident.query.filter_by(user_id = acc.user_id, category_id = category.id).first():
            db.session.add(acc)     

    db.session.commit()



if __name__=="__main__":
    app.run(debug=True, port = 5000, use_reloader=False)




