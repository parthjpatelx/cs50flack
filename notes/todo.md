5/13/2020

## todo: when the page is loaded, we should load all the channnels. 

Plan 1: 
create a javascript code to take the iterate over all the elements in the channel array and add it to the channels list. How will javscript access the channel array if it is being kept on the server? 

Plan 2: 
whenever a channel is added on the client side and a request is emitted to the server, the server should send back the entire channels array.
downside: we are re-loading the channels that were already loaded previosly. we just need to add just the new channels. 

plan 3:
create a seperate websocket to load all channels.  x 
in the corresponding websocket send back the array of channels x
create a js handlebars code to iterate over each channel and add it to the channels page. x


when a new channel is added, it should be added to the html and to the channel array. x


## issue: array is not saving.
solved. 

Note: for som reason updated js file is not being deployed correctly. the form should clear when user enters a submission. also 'new channel' should be removed from the html.



## todo: when user clicks on the channel link, a chatbox continaing the chat history should appear. For now, this chatbox can just be a section of the html page. 

plan:

## link the channel name to a log of its messages

create a chatlog html template which will contain within it a list of all the messages for a given channel. 

create a chatlog handlebars template which iterates over all the messages in a given channel. 

The handlebars template should be added to html. 

if a user clicks on the channnel, a javascript function should be called. this javascript function can be placed under the main DOMContentLoaded function and should query for all channel links by their class. 


how do we store the chats for each channel in the server? should we use a dict?

all_chats = {channel_name : [message 1, message 2, message 3]}

if these links are clcked the should send a request to the get_messages websocket. the request should include the name of the link that was clicked by accessing the html tag's data-channel attribute.

This websocket should return a list of chats for a given channel by accessing the all_chats dict. 

all_chats[channel name] 

the javscript should take that chatlog information and pass the array of chatlogs  into the handlebars template


## the send message form should only send a chat in the current channel. otherwise it should return a javascript alert to select a channel first. 

Additionally we should push the url to new state containing the name of the channel or just /chat. 


create a javscript function that retrieves all the chats in given channel. 


5/14/2020
add the join room and the leave room socket events to the server 
when the DOM page loads, the user should automatically join the 'general'room if a room isn't specifed. 

when hte user clicks on a new room to join:
leave room function
clear current messages 
load messages from new room 


5/15/2020

TODO
remove current channel tracking from server and move to client side
ensure that the channel links are confirgured to link to the respective room.
clear messages once new channel is linked

bugs: 
anytime page is refreshed new channel is created for other user
messages is not working.

when user starts program:
load all of the current channels by sending a request to the server.
if user adds a channel, server should add channel to master list and send back the list of all the channels
client should execute load channels again.


5/16/2020
when a user joins a channel, all the messages in that channel should appear 
when the user sends a message, the server should return the message that was sent and it should be added to the #messages html. 
