import os



print("ENV LOADED:", os.path.exists(".env"))
print("HOST:", os.getenv("REDIS_HOST"))