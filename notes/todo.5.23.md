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
<ensure that the messages event that the server is emitting can only be heard by the users who are currently part of that room.> x 


<WHERE I LEFT OFF>: 
currently i am working on the chat function. when the chat is submtted via the chat form, a message event containing the message should be sent to the server websocket. The websocket should then broadcast all messages in the given channel to all users in that room. 

however, i am having difficulty getting a respose from the server at all. in order to see if the server is respondinmg i added an alert functoin and innerHTML changes when the socket listening for the messages in the channel  hears the event from the server. however, there doesnt seem to be a response.

after this issue is solved, the next step would be to ensure that the message from the server is only being emitted to users in the room. 

the subsequent steps are written above. 


change the message function so that it emits all messages in a given room to everybody x 
change javascript code x
create a hadnlebars template using the already existing template x
pass in the messages x 
set the load messages HTML to the content of HTML template with the messages passed in. x 
revist the emit function and modify it so that it only emits emssages for a given room x 
change the broadcast from True to the broadcast in the room only. x 
ensure that chat box clear after message is submitted. x
Ensure that if a user refershes page they can stil see the messages of the channel they joined.x 
when the page is loaded, if the user is already part of a channnel, we should send an ajax reuest to the server to get a list of all the messages for that server.x 

factor out the AJAX request function to get a list of all the messages. call the function get_messages. it should accept a parameter of channel.x 
check if the messages still load whena channel link is clicked after you factor this out. x 
if they stil load, create a new function that will execute at DOMContentLoaded: if 'channel' local variable exist, send request to server to get all the messages.x




TOODO:

only display channel box if user is connected to a channel. 
    add a 'hide attribute to the chat box X
    if user is part of a channel, unhide the chat box.  X
    the unhide chat function should be placed when the user joins a new channel and at the start of DOMContentLoaded in case user alread belongs to a channel X


ensure that message box cannot be submitted if user is not connected to a channel
    remove the form action in this chat box x 
    add to JS code that info should only be passed to server if local channel variable is not null. x 
    add server-side code that ensures that channel being passed is from javascript server is valid.x 

Bug: after you create a new channel you are unable to join it..need to refreh page first
    it seems that the channel links are only being configured at the start of DOM content loaded. 
    if new channels are added they need to be configured so that user can join the channel when they click on it.
    <factor out the channel link configuration code into a fucntion caled channel_links()>
    bug: when page is refrehsed, the message box appears evn though user isnt part of achannel.
    add channel_links() function to when DOM conent is loaded and whenver you new channel is created.
    I factored the channel link confiuration into a function but this doesn't seem sto be working. Perhaps in JS, in order for a function to be called, it needs to be called directly by an event listener OR contain an argument?
    Try re-factoring but adding an argument instead. doesnt owrk 

    try configure links in a few difernet ways: 
    with and without () after channel name 
    with or without link in paramter -> stil ldoenst work




    What if another user elsewhere creates a channel? Will the link for this sitll work? Yes, because user needs to refresh page to see the new channel which will trigger the DOM contentloaded function to get the list of channels.

if there are no messages in a given channel, indicate this.
if there are are 100 messages in the channel
remove the first element using list.pop
add the next aelement to the list
ALSO as ageneral note make sure you return false whenever a form is submitted that doesn't actually result in a GET request (not including AJAX)



## GO back and see if we can pass in the channel object directly to index.html
create a new class called list in helpers.py
list class will serialize all the channel classes into their names
    NOTE: the <channel> route will also need to be updated so that the iteration is happening over the serialized version of the channels.
           
    
TODO: 5/25/2020: 
the message box is appearing even when channel name is set to null. Perhaps only set channel name varialbe once uer is part of  a channel? => bug solved.
    remove javsascript code that sets up channel variable if there is no channel varialbe already  x 
    change application.py so that it checks for data['previous_chanel'] before storing it into the previous_channel varialbe. x
    if previous channel does not exist, will there be an issue if javascript gets the value of the current channel in local storage when it sends request to server to leave that channel? -> this should just return null.


ensure that channel name does not have any spaces in it in javascript code OR Fix this to allow spaces. When there are spaces, the channel name is not stored properly in lcal storage. Perhaps the chanel name should be converted int oa string before it is passed to the local storage variable.
    steps:
        we get the value of the channel from the form
        javascript passes the value to server via a form
        server gets the value of the form.
        when user joins the channel, the join the channel written in teh data attribute of the corresponding channel link. this is also the value that gets stored in local storage. 
        document.querySelector('#new_channel').value is accurately displaying the value of the form even when there are spaces.
        therefore, the breakdown occurs in the request.form.get fucntion from the server.
added check so that submit button doesn't submit if there is no value in the channel field.
currently working on javascirpt code that doesnt let the user type any spaces.
