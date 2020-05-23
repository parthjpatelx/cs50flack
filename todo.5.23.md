python flask app should pass in messages and channel list directly to index.html

## TOODO: python app should pass in the list of channels directly to index.html. This should not be requested by socket.io
remove all javascript requesting channel list or listening for flask's response x
add functionality in index route that passes in the channel list to index.html x
    GO back and see if we can pass in the channel object directly to index.html
remove the channels handlebars template x 
add jinja templating in the channel_list html to iterate over the given channels that were passed. x
remove channels websocket in application.py x 

## TODO: revisit joining channels. User will not be added to a channel by default.
configure the list of channels so that when the user clicks on it, an event is emitted to the websocket.x 
    ensure that the channel onclick function is working by setting href to '#" and emitting a hello alert when ti is clicked. x 
    add data attribute each channel.x
    ensure that data attribute is working by emitting an alert contianing the data attribute when channel is clicked. x
the join websocket should allow the user to join the new room x

Pass in functionality to leave previous room 
    add functionality in javascript that stores current room in local storage. If user is not part of any rooms, alert "you have not joined any rooms" x 
    add funtionality to JS to pass in previous room so that socket.io can leave that room x
    update local storage with current room x
    add functionality to join websocket in server to leave previous room x

ensure that local storage is updated correcltly by checking developers tools x 



## TOOD: revisit retrieving list of messages in a given channel.
## note: we removed code on line 34 clearing out the current message list 

when user clicks on the channel link, send an AJAX request to the server
    send a request to a 'channel' route 
    create a channel route that returns a string 'messages go here' 
    send a request to route with variable name of channel
    generalize the name of the 'channel' wbesocket to a variable.
    access the messages in that channel and return them as a array





server should return the list of messages 
display all the messages in the html by iterating over them.

## GO back and see if we can pass in the channel object directly to index.html


## TODO: re-visit channel creation
## TODO: revisit sending a message





                //send ajax request to get all the messages in that channel. 
                const request = new XMLHttpRequest();
                request.open('GET', '/channel');

                request.onload = () => {

                    // Extract JSON data from request
                    const data = JSON.parse(request.responseText);
      
                    // Update the result div
                    if (data.success) {
                        const contents = `1 USD is equal to ${data.rate} ${currency}.`
                        document.querySelector('#result').innerHTML = contents;
                    }
                    else {
                        document.querySelector('#result').innerHTML = 'There was an error.';
                    }
                }

            };