import os
import requests

from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_socketio import SocketIO, emit, join_room, leave_room
from helpers import Channel, Message
 

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

#global var, array of channel classes. Can we convert this into a set?
general = Channel(name = 'general')
channels = [general]
channels_serialized = ['general']

#add test messages to the general channel. 
for i in range(98):
    general.add_message(Message(user = 'test', text = f"message {i}"))

# general.add_message(Message(user = 'test', text = "message 1"))
# general.add_message(Message(user = 'test2', text = "message 2"))
# general.add_message(Message(user = 'test3', text = "message 3"))


@app.route("/")
def index():
    return render_template('index.html', channels = channels_serialized)

@app.route("/<channel>", methods=["POST"])
def channel(channel):
    if channel not in channels_serialized:
        return jsonify('not a valid channel')
    for room in channels: 
        if room.name == channel:
            messages = room.serialize()
            break
    return jsonify(messages)

@app.route("/channels", methods=["POST"])
def list ():
    channel = request.form.get("channel")
    if channel in channels_serialized:
        return jsonify({'success' : False})
    channels_serialized.append(channel)
    channels.append(Channel(name = channel))
    return jsonify({'success' : True, 'list' : channels_serialized})

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
            messages = channel.serialize()
            emit('messages', {'messages' : messages}, room= room)
            break 



@socketio.on('join')
def on_join(data):
    channel = data['channel']

    if data['previous']: 
        previous_channel = data['previous']
        leave_room(previous_channel)
    join_room(channel)
    string = jsonify(f'user has succesfully joined {channel}')
    emit('success', {'success' : string})

