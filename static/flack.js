document.addEventListener('DOMContentLoaded', function(){

    //get display name of user
    if (!localStorage.getItem('username')){
        var user = prompt("Please enter a display name");
        localStorage.setItem('username', user);
    }
    
    const username_local = localStorage.getItem('username');

    const template = Handlebars.compile("Welcome {{ user }}!");
    const content = template({"user" : username_local});
    document.querySelector('#greeting').innerHTML += content;


    // connect with WebSocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        var current_channel = 'general';
        
        //configure create channel form
        document.querySelector('#create_channel').onsubmit = () => {
            const name = document.querySelector('#new_channel').value; 
            socket.emit('channels', {'new_channel': name});
            document.querySelector('#new_channel').value = '';
            return false; 
        };

        //configure channel links 
        document.querySelectorAll('.channel').forEach(link => {
            link.onclick = () => {
                previous_channel = current_channel
                current_channel = link.dataset.channel;
                document.querySelector('#messages').innerHTML= '';
                socket.emit('join', {"username": username_local, "channel" : current_channel, "previous_channel": previous_channel});
            };
        });

        document.querySelector('#chat_form').onsubmit = () => {
            const message = document.querySelector('#message').value; 
            socket.emit('message', {"username": username_local, "channel" : current_channel, "message" : message});
        };

        //load all the channels
        socket.emit('channels', {'new_channel': null});
        
        //join general channel
        socket.emit('join', {"username": username_local, "channel" : 'general', "previous_channel" : null});
    });

    //listen for when socket returns a channel list.
    socket.on('channel_list', data => {
        const channel_template = Handlebars.compile(document.querySelector('#load_channels').innerHTML); 
        const channel_content = channel_template({"channels" : data.channels});    
        document.querySelector('#channels').innerHTML = channel_content;
    });

    //add a new message in a given channel.
    socket.on('send_message', data => {
        const li_message = document.createElement('li');
        li_message.innerHTML = `${data.sent_message}`;
        document.querySelector('#messages').append(li_message);
    });

    //after user joins channels, load all the messages 
    socket.on('all messages', data => {
        if (data.messages < 1 || data.messages == undefined)
        {
            document.querySelector('#messages').innerHTML = 'error transmitting message from server';
        }
        else
        {
            document.querySelector('#messages').innerHTML += 'message recieved';
            const messages_template = Handlebars.compile(document.querySelector('#load_messages').innerHTML); 
            const messages_content = messages_template({"messages" : data.messages });    
            document.querySelector('#messages').innerHTML += messages_content;
        }

    });

});