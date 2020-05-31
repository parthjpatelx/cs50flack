Bug:
Create a new channel
type in a message. 
However, you cannot see the message.

server
    in join websocket, emit 'user has succesfully joined channel' x 

js
    in javascript, parse this message and add it to the content of success.

it seems that when a user is creating a new channel, the socket 'join' function does not get a chance to fire before the refresh function is called. However, when the user clicks on the channel name, she can see the full list of messages.
instead i think we should add the join function to the start of DOM content loaded. 

instead of storing previous channel as a variable store it local storage x 
at the beginnig of the socket.io connection, leave the previous channel and join current channel. 

bug: when we click on the channel name first time it is bolded.=> solved
when we click on it again, it turns back to normal.
If a user sends message in that channel and clicks on it again, the 'no messages in this channel' error will appear when only message is sent. 



TOOD: 
ENsure that messages contain content before allowing it to send.
    see if it is possilbe to factor out the code enforcing that channel form needs to contian content.
    create a check_contnet function
protect against special characters in channel name
Enforce a 100 message limit 

