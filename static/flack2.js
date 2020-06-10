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
        console.log('connected');

        if(localStorage.getItem('channel')){
            channel = localStorage.getItem('channel');
            previous = localStorage.getItem('previous');
            get_messages(channel);
            document.querySelector("#chat_form").style.visibility = "visible";
            document.querySelector(`#${channel}`).style.fontWeight = "bold";
            socket.emit('join', {'channel' : channel, 'previous' : previous});
        }

        //configure create channel form
        document.querySelector('#create_channel').onsubmit = () => {
            const name = document.querySelector('#new_channel').value; 

            let string = `${name}`
            let array = string.split('');
            special_characters = ['!','@', '#', '%', '^', '&', '*', '(', ')', ' ', ']', '[', ';', ',']; 
            for (let i = 0; i < array.length; i++){
                if (special_characters.includes(array[i])){
                    alert('channel name may not contain any spaces or special characters');
                    document.querySelector('#new_channel').value = '';
                    return false; 
                }
            }
    
            //send ajax request to get a list of channels 
            const request = new XMLHttpRequest();
            request.open('POST', '/channels');

            request.onload = () => {
                // Extract JSON data from request
                const data = JSON.parse(request.responseText);
                if (data.success){
                    localStorage.setItem('previous', localStorage.getItem('channel'));
                    localStorage.setItem('channel', name);
                    const template = Handlebars.compile(document.querySelector('#new_channels').innerHTML); 
                    const content = template({"channels" : data.list });
                    document.querySelector('#channels').innerHTML = content
                    //refresh page
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
                if (previous != channel){
                    socket.emit('join', {'channel' : channel, 'previous': previous});
                    localStorage.setItem('channel', channel);
                    document.querySelector("#chat_form").style.visibility = "visible";
                    get_messages(channel);
                    document.querySelector(`#${channel}`).style.fontWeight = "bold";
                    document.querySelector(`#${previous}`).style.fontWeight = "normal";
                }
                else{
                    return false; 
                }
            }
        });


        //configure chat form 
        document.querySelector('#chat_form').onsubmit = () => {
            if (localStorage.getItem('channel')){

                if (document.querySelector('#file').value.length != 0){
                    file = document.querySelector('#file').files[0];
                    message = document.querySelector('#message').value;

                    document.querySelector('#message').value = '';
                    document.querySelector('#file').value = '';


                    // send AJAX request to ensure filename is not secure/get filename 
                    const request = new XMLHttpRequest();
                    request.open('POST', '/upload');

                    request.onload = function(){
                        const data = JSON.parse(request.responseText);
                        if (data.success){
                            filename = data.filename;
                            socket.emit('message', 
                                        {"username": localStorage.getItem('username'),
                                        "channel" : localStorage.getItem('channel'),
                                        "message" : message, 
                                        'file' : filename});
                        }
                        else{
                            socket.emit('message', 
                                {"username": localStorage.getItem('username'),
                                "channel" : localStorage.getItem('channel'),
                                "message" : 'request error', 
                                'file' : 'request error'});
                        }
                    }
    
                    const data = new FormData();
                    data.append('file', file);
                    request.send(data);

                }
            }
            return false; 
        }  
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

    // Enable button only if there is text in the input field
    document.querySelector('#send').disabled = true;

    document.querySelector('#message').onkeyup = () => {
        var string = document.querySelector('#message').value;
        if (string.length > 0){
            document.querySelector('#send').disabled = false;
        }
        else{
            document.querySelector('#send').disabled = true;
        }
    };


    socket.on('messages', data => {
        const template = Handlebars.compile(document.querySelector('#messages_template').innerHTML); 
        const content = template({"messages" : data.messages });
        document.querySelector('#messages').innerHTML = content

        document.querySelectorAll('.filename').forEach(link => {
            link.onclick = function(){
                filename = link.dataset.filename;
                const request = new XMLHttpRequest();
                request.open('GET', `/upload/${filename}`);   
            }
        });

        scroll_last();
    });

});


function get_messages(channel){
    const request = new XMLHttpRequest();
    request.open('POST', `/${channel}`);

    request.onload = () => {
        // Extract JSON data from request and display the messages
        const data = JSON.parse(request.responseText);
        if (data.length > 1){
            const messages_template = Handlebars.compile(document.querySelector('#messages_template').innerHTML); 
            const messages_content = messages_template({"messages" : data });
            document.querySelector('#messages').innerHTML = messages_content;
        }
        else{
            document.querySelector('#messages').innerHTML = 'no messages to display'
        }

        document.querySelectorAll('.filename').forEach(link => {
            link.onclick = function(){
                filename = link.dataset.filename;
                const request = new XMLHttpRequest();
                request.open('GET', `/upload/${filename}`);   
            }
        });

        scroll_last();
        // after all messages are loaded configure the links of each element of class attachment
        //get the fielname by of the attachment by accessng the data-attachment
        //when the links are clicked send an AJAX request to the upload/flename of the server
        //the  server should return thefile as an attachment

    }

    // Send request
    request.send();
}


function scroll_last(){
    var last_message = document.querySelector("#messages").lastElementChild;
    if (last_message){
        last_message.scrollIntoView();
        console.log(last_message);
    }
}