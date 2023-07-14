import numpy as np
import os
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect, MetaData, Table, select
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime

cwd = os.getcwd()
print(cwd)

engine = create_engine("sqlite:///Backend/WildfiresDB.db")

metadata = MetaData(bind=engine)

inspector = inspect(engine)
#print(inspector.get_table_names())

columnNames = []
columns = inspector.get_columns("fire_data")
for c in columns:
    print(c["name"], c["type"])
    columnNames.append("wildfires.c." + c["name"])
print(columnNames)

wildfires = Table("fire_data", metadata, autoload=True, autoload_with=engine)
print(engine.execute("select DISCOVERY_DATE from fire_data").first())

"""" DOES NOT WORK FOR SOME REASON
Base = automap_base()
Base.prepare(autoload_with=engine)
wildfires = Base.classes.fire_data
table_names = list(Base.classes.keys())"""

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return(
        f"Available Routes:<br/>"
    )

@app.route("/api/cawildfires17-20")
def cawildfires():
    session = Session(engine)
    sel = select([wildfires.c.COUNTY, wildfires.c.LATITUDE, wildfires.c.LONGITUDE, 
                  wildfires.c.FIRE_NAME, wildfires.c.FIRE_SIZE, wildfires.c.FIRE_SIZE_CLASS, wildfires.c.FIRE_YEAR, 
                  wildfires.c.DISCOVERY_DATE, 
                  wildfires.c.CONTAIN_DATE, 
                  wildfires.c.CAUSE_CLASSIFICATION, wildfires.c.CAUSE, wildfires.c.FREQUENCY])
    wildfireData = session.execute(sel).fetchall()
    session.close()
    api = []
    for row in wildfireData:
        dict = {}
        dict["COUNTY"] = row.COUNTY
        dict["LATITUDE"] = row.LATITUDE
        dict["LONGITUDE"] = row.LONGITUDE
        dict["FIRE_NAME"] = row.FIRE_NAME
        dict["FIRE_SIZE"] = row.FIRE_SIZE
        dict["FIRE_SIZE_CLASS"] = row.FIRE_SIZE_CLASS
        dict["FIRE_YEAR"] = row.FIRE_YEAR
        dict["DISCOVERY_DATE"] = row.DISCOVERY_DATE
        dict["CONTAIN_DATE"] = row.CONTAIN_DATE
        dict["CAUSE_CLASSIFICATION"] = row.CAUSE_CLASSIFICATION
        dict["CAUSE"] = row.CAUSE
        dict["FREQUENCY"] = row.FREQUENCY
        api.append(dict)
    #print(api)
    return jsonify(api)

if __name__ == '__main__':
    app.run(debug=True)