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
    send a request to a 'channel' route x
    create a channel route that returns a string 'messages go here'x  
    send a request to route with variable name of channel x 
    generalize the name of the 'channel' wbesocket to a variable.x
    return the name of the channel. x
    create a class for the general channel x
    add two messages to the general channel x
    access the messages of the 'general' channel x
    access the messages in that channel and return them as a array x
    modify the route so that it only accepts post requests x
    server should return the list of messages x

display all the messages in the html by iterating over them.
    create a handlebars templatex
    pass in the messages that we got from the server to the handlebars template.X
    in the handlebars template, iterate over the user and message keys X
        mesaages should be displayed as User: messages X
        http://jsfiddle.net/gV7YZ/
    Note: we cannot pass in the messages class (even if it is serialized) ot the server since it server wont let us jsonify it 
    passing the object as a string and trying to reconstitute it as a dict using json.parse isnt working
    instead, get rid of classes and express the messages manually using dict structure
    OR re-visit classes. instead of adding seralized mesages to a property of the class itself, add it to an array outside that class. => SOLVED 

WHERE I LEFT OFF 5/23/2020:
i am trying to figure out whether to re-format the classes and express messages manually using dict or re-visiting classes. I suspect that objects are not being properly jsonified beacause serialzied messaged array is still technically belongs to the class it is referencing. I changed helpers.py serialize function to directly return a message array which is not a proeprty of the class. moreover, i expressed the values of each key as strings instead of the class property.



## TODO: re-visit channel creation
when channels are created, should the data be sent as a socket.io request or as an AJAX request?
Data should be sent via AJAX request otherwise the addition of new channels might be distracting if app is constantly listening for new channel creation.

when a channel is created, send ajax request to server route 'channels'
    we will need a handlebars template since the channel list is being received by the javascript x
    create a handlebars template x 
    pass in the  channel list to the handlebars template x 




clear out channel form after request is placed. x
create a route called 'channels' in the server.x
server should add the channel to the channel list. x

server should return a list of ALL channels not just the one that was created. Otherwise, the full list of channels  might not be displayed  if multiple users are creating channels concurrently  x 
pass in teh channel list to the handelabrs template. x
if channnel creation in unssuccessful or channel already exists, return a javascript alert raising an error message x
ensure that channel is not already in our channel list. x





## TODO: revisit sending a message
javascript should pass in the current channel, user, and the message itself. x
when a user sends a message, the message should be added to the channel messages list x
the server should emit ALL messages in the channel as well as the user who sent that message ONLY to people in that room x
<ensure that the messages event that the server is emitting can only be heard by the users who are currently part of that room.>
the messages that client recieves should be passed into the message handelbars template 
if there are are 100 messages in the channel
remove the first element using list.pop
add the next aelement to the list

<WHERE I LEFT OFF>: 
currently i am working on the chat function. when the chat is submtted via the chat form, a message event containing the message should be sent to the server websocket. The websocket should then broadcast all messages in the given channel to all users in that room. 

however, i am having difficulty getting a respose from the server at all. in order to see if the server is respondinmg i added an alert functoin and innerHTML changes when the socket listening for the messages in the channel  hears the event from the server. however, there doesnt seem to be a response.

after this issue is solved, the next step would be to ensure that the message from the server is only being emitted to users in the room. 

the subsequent steps are written above. 





## GO back and see if we can pass in the channel object directly to index.html
create a new class called list in helpers.py
list class will serialize all the channel classes into their names
    NOTE: the <channel> route will also need to be updated so that the iteration is happening over the serialized version of the channels.
           
        