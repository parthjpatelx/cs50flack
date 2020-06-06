import os
import requests
import datetime

from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_socketio import SocketIO, emit, join_room, leave_room
from helpers import Channel, Message, serialize_channels
 

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

#global var, array of channel classes. Can we convert this into a set?
general = Channel(name = 'general')
channels = [general]

#add test messages to the general channel. 
for i in range(98):
    general.add_message(Message(user = 'test', text = f"message {i}"))

# load page with channel list
@app.route("/")
def index():
    return render_template('index.html', channels = serialize_channels(channels))

#get messages for a given channel
@app.route("/<channel>", methods=["POST"])
def channel(channel):
    if channel not in serialize_channels(channels):
        return jsonify('not a valid channel')
    for room in channels: 
        if room.name == channel:
            return jsonify(room.serialize())
    

#support creating a new channel
@app.route("/channels", methods=["POST"])
def list ():
    channel = request.form.get("channel")
    if channel in serialize_channels(channels):
        return jsonify({'success' : False})
    channels.append(Channel(name = channel))
    return jsonify({'success' : True, 'list' : serialize_channels(channels)})

#send messages over a given channel to all users part of that channel.
@socketio.on('message')
def message(data):
    username = data['username']
    room = data['channel']
    message = data['message']

    for channel in channels: 
        if channel.name == room:
            if len(channel.messages) == 100:
                channel.messages.pop(0)
            channel.add_message(Message(user = username, text = message))
            emit('messages', {'messages' : channel.serialize()}, room= room)
            break 

#join a channel
@socketio.on('join')
def on_join(data):
    channel = data['channel']
    if data['previous']: 
        previous_channel = data['previous']
        leave_room(previous_channel)
    join_room(channel)
