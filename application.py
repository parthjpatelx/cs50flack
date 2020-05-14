import os
import requests

from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on("load_channels")
def load_channels():
    emit("channel_list", {"channels" : channels}, broadcast=True)


@socketio.on("create_channel")
def channel(data):
    try:
        new_channel = data["new_channel"]
    except:
        new_channel = 'Error transmitting channel'

    channels.append(new_channel)
    
    #Emit the channel name back to the client side
    emit("channel", {"channel": new_channel}, broadcast=True)



