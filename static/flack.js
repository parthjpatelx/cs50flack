document.addEventListener('DOMContentLoaded', function(){


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

    // When connected, load channels and configure the 'create channel' form
    socket.on('connect', () => {

        socket.emit('load_channels');

        socket.emit('join', {"username": username_local, "channel" : 'general'});

        document.querySelector('#create_channel').onsubmit = () => {
            const name = document.querySelector('#new_channel').value; 
            socket.emit('create_channel', {'new_channel': name});
            document.querySelector('#new_channel').value = '';
            return false; 
        };
  
    });
    //create a new channel
    socket.on('channel', data => {
        const li = document.createElement('li');
        li.innerHTML = `${data.channel}`;
        document.querySelector('#channels').append(li);
    });
    //load all the channels when DOM content is loaded
    socket.on('channel_list', data => {
        const channel_template = Handlebars.compile(document.querySelector('#load_channels').innerHTML); 
        const channel_content = channel_template({"channels" : data.channels});    
        document.querySelector('#channels').innerHTML += channel_content;
    });

    socket.on('message', data => {
        const li_message = document.createElement('li');
        li_message.innerHTML = `${data.message}`;
        document.querySelector('#messages').append(li_message);
    });

});
