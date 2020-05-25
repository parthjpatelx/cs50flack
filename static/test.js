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

