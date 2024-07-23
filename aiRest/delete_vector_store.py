# This program will clear vector stores from the openAI DB.
# You should reuse vector stores and/or delete them when not needed
# But if you forget to do that, use this script
# Change the "current_store" variable to the name of the vector store to delete

# You can provide the name of the vector store to delete as a command line argument

import os
from openai import OpenAI
from openai import AssistantEventHandler
from typing_extensions import override  # Import override decorator if needed
import sys

# Initialize the OpenAI API client
client = OpenAI()

# Construct a unique identifier for the assistant (for workshop purposes, the assistant name includes the user's GitHub username)
current_store = "Comp210"
if len(sys.argv) > 1:
    current_store = sys.argv[1]
else:
    print("syntax: \n\tdelete_vector_store nameOfVectorStoreToDelete\n")
    print("Use the name 'print' to just list all current vector stores\n")
    exit(0)

all_stores = {vector.name: vector.id for vector in client.beta.vector_stores.list(limit=100).data}

if current_store == "print": 
    print("All Stores:") 
    print(all_stores) 
    print()
    exit(0);

# print("deleting store named " + current_store)
while current_store in all_stores:
	
	# print(current_store + ": ", end = ' ')
	# print(all_stores[current_store])
	# print()
	
	response = client.beta.vector_stores.delete(all_stores[current_store])
	# print(response)
	# print()
	
	# Retrieve a list of all existing assistants and map their names to their IDs 
	all_stores = {vector.name: vector.id for vector in client.beta.vector_stores.list(limit=100).data}
	
	# print(all_stores)
	# print()

print("vector store updated")
