import os
from pymongo import MongoClient


class MongoAdapter:
    # create a class to handle the connection with MongoDB using Singleton pattern

    __instance = None
    __client = None
    __db = None

    def __new__(cls):
        if MongoAdapter.__instance is None:
            MongoAdapter.__instance = object.__new__(cls)
        return MongoAdapter.__instance

    def __init__(self):
        if self.__client is None:
            self.__client = MongoClient(os.environ.get("MONGO_URL"))
            self.__db = self.__client['pmqc']

    def get_client(self):
        return self.__client

    def get_db(self):
        return self.__db

    def get_collection(self, collection_name):
        return self.__db[collection_name]

    def get_collection_names(self):
        return self.__db.list_collection_names()

    def get_collection_count(self, collection_name):
        return self.__db[collection_name].count_documents({})

    def get_collection_indexes(self, collection_name):
        return self.__db[collection_name].index_information()

    def get_collection_indexes_names(self, collection_name):
        return self.__db[collection_name].index_information().keys()

    def get_collection_indexes_count(self, collection_name):
        return len(self.__db[collection_name].index_information().keys())
