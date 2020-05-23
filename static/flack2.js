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

    //remember current room or set up the channel variable.
    if (!localStorage.getItem('channel')){
        localStorage.setItem('channel', null);
    }


    // connect with WebSocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        
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
                //join the room in socket.io
                channel = link.dataset.channel;
                socket.emit('join', {'channel' : channel, 'previous': localStorage.getItem('channel')});
                localStorage.setItem('channel', channel);

                //send ajax request to get a list of messages 
                const request = new XMLHttpRequest();
                request.open('POST', `/${channel}`);

                request.onload = () => {
                    // Extract JSON data from request and display the messages
                    const data = JSON.parse(request.responseText);
                    const messages_template = Handlebars.compile(document.querySelector('#messages_template').innerHTML); 
                    // example = [{text: 'message 1', user: 'test'}, {text: 'message 2', user: 'test2'}]
                    const messages_content = messages_template({"messages" : data });
                    document.querySelector('#messages').innerHTML = messages_content;
                }

                // Send request
                request.send();
                return false;
            }
        });

        //configure chat form 
        document.querySelector('#chat_form').onsubmit = () => {
            const message = document.querySelector('#message').value; 
            socket.emit('message', {"username": username_local, "channel" : current_channel, "message" : message});
        };

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
            document.querySelector('#messages').innerHTML = 'No messages in this channel!';
        }
        else
        {
            // // document.querySelector('#messages').innerHTML += data.count
            // const messages_template = Handlebars.compile(document.querySelector('#load_messages').innerHTML); 
            // const messages_content = messages_template({"messages" : data.messages });    
            // document.querySelector('#messages').innerHTML = messages_content;
        }

    });
});
