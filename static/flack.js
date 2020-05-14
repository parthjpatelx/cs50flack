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

    // When connected, configure buttons
    socket.on('connect', () => {

        document.querySelector('#create_channel').onsubmit = () => {
            const name = document.querySelector('#new_channel').value; 
            socket.emit('create_channel', {'new_channel': name});
            return false; 
        };
  
    });

    socket.on('channel', data => {
        const li = document.createElement('li');
        li.innerHTML = `New Channel: ${data.channel}`;
        document.querySelector('#channels').append(li);
    });


});



socket.on('connect', () => {

    // Each button should emit a "submit vote" event
    document.querySelectorAll('button').forEach(button => {
        button.onclick = () => {
            const selection = button.dataset.vote;
            socket.emit('submit vote', {'selection': selection});
        };
    });
});