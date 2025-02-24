from fastapi import FastAPI, Query
from database import supabase
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
def home():
    return {"message": "Welcome to Arxiv Social!"}

PAGE_SIZE = 10  # Number of papers per page

@app.get("/papers")
def get_papers(page: int = Query(1, alias="page"), limit: int = Query(10, alias="limit")):
    """
    Fetch paginated research papers from Supabase.
    """
    offset = (page - 1) * limit  # Calculate offset for pagination

    response = (
        supabase.table("papers_test")
        .select("*")
        .order("arxiv_id", desc=True)
        .range(offset, offset + limit - 1)  # Apply pagination
        .execute()
    )

    # Extract actual data from response
    papers = response.data if response and response.data else []

    return {"papers": papers, "page": page, "limit": limit}

