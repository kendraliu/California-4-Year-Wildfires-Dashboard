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
columns = inspector.get_columns("fire_data")
for c in columns:
    print(c["name"], c["type"])

wildfires = Base.classes.fire_data


app = Flask(__name__)