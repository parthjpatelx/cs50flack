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
general.add_message(Message(user = 'test', text = "message 1"))
general.add_message(Message(user = 'test2', text = "message 2"))
general.add_message(Message(user = 'test3', text = "message 3"))


@app.route("/")
def index():
    return render_template('index.html', channels = channels_serialized)

@app.route("/<channel>", methods=["POST"])
def channel(channel):
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


    
# @socketio.on("channels")
# def channel(data):
#     if data['new_channel']:
#         new_channel = data['new_channel']
#         channels.append(Channel(name = new_channel))
#         channels_serialized.append(data['new_channel'])
#     #TOODO: add code to ensure that we don't have channels with duplicate names.
#     emit("channel_list", {"channels": channels_serialized}, broadcast=True)


@socketio.on('join')
def on_join(data):
    channel = data['channel']
    previous_channel = data['previous']

    if previous_channel: 
        leave_room(previous_channel)
    join_room(channel)


    # if data['previous_channel']:
    #     previous_channel = data['previous_channel']
    #     leave_room(previous_channel)
    # if join_room(new_channel):
    #     success = True 

    # #upon joining the room, load all the messages in that chat.
    # for channel in channels: 
    #     if channel.name == new_channel:
    #         # channel.add_message(Message(user = user, text = f"{user} has joined {channel.name}" ))
    #         channel.serialize()
    #         messages = channel.messages_serialized
    #         count = len(messages)
    #         emit('all messages', {'messages': messages, 'success': success, 'count' : count}, room=new_channel)
    #         break


@socketio.on('message')
def message(data):
    channel_name = data['channel']     
    #add message to to the list of channel messages and emit the new message only.
    for channel in channels: 
        if channel.name == channel_name:
            channel.add_message(Message(user = data['username'], text = data['message']))
            emit("send_message", {"sent_message" : data['message']})
            break