import os
import requests

from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

@app.route("/")
def index():
    return render_template('index.html')


@socketio.on("create_channel")
def channel(data):
    try:
        new_channel = data["new_channel"]
    except:
        new_channel = 'Error transmitting channel'
    
    #Emit the channel name back to the client side
    emit("channel", {"channel": new_channel}, broadcast=True)



    #when user loads the page, display current list of channels
    #server side returns the list of new channels 
    #client side emits the name of the new channel
    #iterate over the array of new chanels and add it to innerhtml 
