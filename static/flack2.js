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

    if(localStorage.getItem('channel'))
    {
        get_messages(localStorage.getItem('channel'));
        document.querySelector("#chat_form").style.visibility = "visible";
    }


    // connect with WebSocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {

        //configure create channel form
        document.querySelector('#create_channel').onsubmit = () => {
            const name = document.querySelector('#new_channel').value; 

            let string = `${name}`
            let array = string.split('');
            for (let i = 0; i < array.length; i++){
                if (array[i] == ' '){
                    alert('channel name may not contain any spaces');
                    document.querySelector('#new_channel').value = '';
                    return false; 
                }
            }
    
            //send ajax request to get a list of messages 
            const request = new XMLHttpRequest();
            request.open('POST', '/channels');

            request.onload = () => {
                // Extract JSON data from request
                const data = JSON.parse(request.responseText);
                if (data.success){
                    const template = Handlebars.compile(document.querySelector('#new_channels').innerHTML); 
                    const content = template({"channels" : data.list });
                    document.querySelector('#channels').innerHTML = content
                    location.reload();
                }
                else
                {
                    alert('please select a unique channel name');
                }
                document.querySelector('#new_channel').value = '';
            }

            const data = new FormData();
            data.append('channel', name);
            request.send(data);
            return false; 
        };
        
        //configure channel links
        document.querySelectorAll('.channel').forEach(link => {
            link.onclick = () => {
                //join the room in socket.io
                previous = localStorage.getItem('channel')
                channel = link.dataset.channel;
                socket.emit('join', {'channel' : channel, 'previous': previous});
                localStorage.setItem('channel', channel);
                document.querySelector("#chat_form").style.visibility = "visible";
                get_messages(channel);
            }
        });


        //configure chat form 
        document.querySelector('#chat_form').onsubmit = () => {
            if (localStorage.getItem('channel')){
                const message = document.querySelector('#message').value; 
                socket.emit('message', {"username": localStorage.getItem('username'), "channel" : localStorage.getItem('channel'), "message" : message});
                document.querySelector('#message').value = '';
            }
            else{
                alert('error: You must be part of a channel to submit a message')
            }
            return false; 
        };

    });

    // Enable button only if there is text in the input field
    document.querySelector('#button_channel').disabled = true;

    document.querySelector('#new_channel').onkeyup = () => {
        var string = document.querySelector('#new_channel').value;
        if (string.length > 0){
            document.querySelector('#button_channel').disabled = false;
        }
        else{
            document.querySelector('#button_channel').disabled = true;
        }
    };


    socket.on('messages', data => {
        const template = Handlebars.compile(document.querySelector('#messages_template').innerHTML); 
        const content = template({"messages" : data.messages });
        document.querySelector('#messages').innerHTML = content
    });

});


function get_messages(channel){
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
}
