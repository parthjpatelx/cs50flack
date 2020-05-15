import os
import requests

from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []
current_channel = None

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




@socketio.on('join')
def on_join(data):
    global current_channel
    if current_channel:
        leave_room(current_channel)
    username = data['username']
    current_channel = data['channel']
    join_room(current_channel)
    emit("message", {"message" : f'{username} has entered {current_channel}' }, room=current_channel)