import numpy as np
import os
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect
from flask import Flask, jsonify

cwd = os.getcwd()
print(cwd)

engine = create_engine("sqlite:///Backend/WildfiresDB.db")
Base = automap_base()
Base.prepare(autoload_with=engine)

inspector = inspect(engine)
print(inspector.get_table_names())

columnNames = []
columns = inspector.get_columns("fire_data")
for c in columns:
    print(c["name"], c["type"])
    columnNames.append("wildfire." + c["name"])
print(columnNames)

wildfires = Base.classes.fire_data


"""app = Flask(__name__)

@app.route("/")
def home():
    return(
        f"Available Routes:<br/>"
    )

@app.route("/api/cawildfires17-20")
def cawildfires():
    session = Session(engine)

    
    wildfireData = session.query(columnNames).all()
    """