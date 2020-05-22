import os
import requests

from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_socketio import SocketIO, emit, join_room, leave_room
from helpers import Channel, Message
 

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

#global var, array of channel classes. Can we convert this into a set?
channels = [Channel(name = 'general')]

@app.route("/")
def index():
    return render_template('index.html')

@socketio.on("channels")
def channel(data):
    if data['new_channel']:
        new_channel = data['new_channel']
        channels.append(Channel(name = new_channel))
    channels_serialized = []
    for channel in channels: 
        channels_serialized.append(channel.name)
    #TOODO: add code to ensure that we don't have channels with duplicate names.
    if channels_serialized: 
        emit("channel_list", {"channels": channels_serialized}, broadcast=True)


@socketio.on('join')
def on_join(data):
    new_channel = data['channel']
    user = data['username']
    success = False 

    if data['previous_channel']:
        previous_channel = data['previous_channel']
        leave_room(previous_channel)
    if join_room(new_channel):
        success = True 

    #upon joining the room, load all the messages in that chat.
    for channel in channels: 
        if channel.name == new_channel:
            channel.add_message(Message(user = user, text = f"{user} has joined {channel.name}" ))
            channel.serialize()
            messages = channel.messages_serialized
            count = len(messages)
            emit('all messages', {'messages': messages, 'success': success, 'count' : count}, room=new_channel)
            break


@socketio.on('message')
def message(data):
    channel_name = data['channel']     
    #add message to to the list of channel messages and emit the new message only.
    for channel in channels: 
        if channel.name == channel_name:
            channel.add_message(Message(user = data['username'], text = data['message']))
            emit("send_message", {"sent_message" : data['message']})
            break




