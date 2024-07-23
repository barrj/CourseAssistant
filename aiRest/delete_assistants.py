# This program will clear assistants from the openAI DB.
# You should reuse assistants and/or delete them when not needed
# But if you forget to do that, use this script
# Change the "current_assistant" variable to the name of the assistant to delete

# You can provide the name of the assistant to delete as a command line argument

import os
import openai
from openai import OpenAI
from openai import AssistantEventHandler
from typing_extensions import override  # Import override decorator if needed
import sys

# Initialize the OpenAI API client
client = OpenAI()

# Construct a unique identifier for the assistant
current_assistant = "Jeeves"

# get the name of the assistant to delete from the command line
if len(sys.argv) > 1:
    current_assistant = sys.argv[1]
else:
    print("syntax: \n\tpython delete_assistants.py nameOfAssistantToDelete\n")
    print("use the name 'print' to just list all current assistants\n")
    exit(0)

all_assistants = {assistant.name: assistant.id for assistant in client.beta.assistants.list(limit=100).data}


if current_assistant == "print": 
    print("All Assistants:") 
    print(all_assistants) 
    print()
    exit(0)

# print("Deleting assistants named " + current_assistant)

if not current_assistant in all_assistants:
    print(current_assistant + " removed!")
    exit(0)

while current_assistant in all_assistants:
	
	# print(current_assistant + ": ", end = ' ') 
	# print(all_assistants[current_assistant])
	# print()
	
	response = client.beta.assistants.delete(all_assistants[current_assistant])
	print(current_assistant + " removed!")
	print()
	
	# Retrieve a list of all existing assistants and map their names to their IDs
	all_assistants = {assistant.name: assistant.id for assistant in client.beta.assistants.list(limit=100).data}
	
	# print(all_assistants)
	# print()

