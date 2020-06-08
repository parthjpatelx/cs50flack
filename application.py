import os
import requests
import datetime

from flask import Flask, flash, jsonify, redirect, render_template, request, session, url_for, send_from_directory, abort
from flask_socketio import SocketIO, emit, join_room, leave_room
from helpers import Channel, Message, serialize_channels, allowed_file, ALLOWED_EXTENSIONS
from werkzeug.utils import secure_filename
 

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

UPLOAD_FOLDER = 'C:/Users/Parth/project2/cs50flack/message_attachments/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#global var, array of channel classes. Can we convert this into a set?
general = Channel(name = 'general')
channels = [general]

#add test messages to the general channel. 
for i in range(98):
    general.add_message(Message(user = 'test', text = f"message {i}", filename = None))

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
    filename = data['filename']

    for channel in channels: 
        if channel.name == room:
            if len(channel.messages) == 100:
                channel.messages.pop(0)
            channel.add_message(Message(user = username, text = message, filename = filename))
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

#Based on flask documentation: https://flask.palletsprojects.com/en/1.1.x/patterns/fileuploads/#upload-progress-bars
@app.route("/upload", methods=['GET','POST'])
def upload(): 
    if request.method == 'GET':
        return render_template('upload.html')
    if request.method == 'POST':
        #access file to file dictionary of the request object
        file = request.files['file']
        #save file locally
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('uploaded_file',filename=filename))
        else:
            return ('please select a valid file type')

@app.route('/upload/<filename>')
def uploaded_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename=filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)