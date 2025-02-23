from fastapi import FastAPI
from database import supabase

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welcome to Arxiv Social!"}

@app.get("/papers")
def get_papers():
    response = supabase.table("papers").select("*").execute()
    print(response.data)
    return response.data  # Returns JSON response