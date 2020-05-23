class Channel:
    counter = 0
    def __init__(self, name):
        self.name = name
        self.messages = []
        # self.messages_serialized = []
        # self.name_serialized = []

        self.id = Channel.counter
        Channel.counter += 1
    
    def add_message(self, m):
        self.messages.append(m)

    # def serialize(self):
    #     for message in self.messages:
    #         self.messages_serialized.append({"text" : message.text, "user": message.user})

    def serialize(self):
        messages = []
        for message in self.messages:
            messages.append({"text" : f"{message.text}", "user": f"{message.user}"})
        return messages
    
    # def serialize_name(self):
    #     self.name_serialized.append({"name": self.name})


class Message:
    counter = 0
    def __init__(self, user, text):
        self.text = text
        self.user = user

        self.id = Message.counter
        Message.counter += 1


# general = Channel(name = 'general')
# message = Message(text = 'hello', user = 'parth')
# general.add_message(message)
# general.serialize()
# print(f"{general.messages_serialized}")




# example:
# parth = User(user = 'parth')
# hello = Message(user = parth, text = 'hello')
# general = Channel(name = 'general')
# general.add_message(hello)

# for message in general.messages:
#     if message.user = parth:
#         #all the messages submitted  by Parth in his channel