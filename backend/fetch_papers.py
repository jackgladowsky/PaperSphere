import httpx
import feedparser
from database import supabase  # Import the Supabase client
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
import os
import re

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
LM_STUDIO_URL=os.getenv("LM_STUDIO_URL")

try:
    client = OpenAI(
    #base_url="https://openrouter.ai/api/v1",
    base_url=LM_STUDIO_URL,
    api_key=OPENROUTER_API_KEY,
    )
except Exception as e:
    print("Error creating LLM client:", e)

MAX_RESULTS = 250

# Define the arXiv API URL (adjust query to your needs)
ARXIV_API_URL = f"http://export.arxiv.org/api/query?search_query=cat:cs.*&max_results={MAX_RESULTS}&sortBy=submittedDate&sortOrder=descending"
#ARXIV_API_URL = f"http://export.arxiv.org/api/query?search_query=all&max_results={MAX_RESULTS}&sortBy=submittedDate&sortOrder=descending&start=0"

DATABASE_TABLE = "papers"

async def generate_summary(abstract):
    """Generate a short summary of a research paper abstract using GPT-4."""
    #print(abstract)
    try:
        response = client.chat.completions.create(
            #model="mistralai/mistral-small-24b-instruct-2501:free",
            model="hermes-3-llama-3.2-3b",
            messages=[
                    {"role": "system", "content": "Summarize this research paper in 2-3 sentences. Be clear and concise. Try and use language anyone can understand."},
                    {"role": "user", "content": abstract}
                ]
            )
        summary = response.choices[0].message.content.strip()
        #summary = response.choices[0].message.strip()
        return summary
    except Exception as e:
        print("Error generating summary:", e)
        return None  # If LLM fails, store None instead of breaking
    
def paper_exists(arxiv_id):
    """Check if a paper with the given arXiv ID already exists in the database."""
    response = supabase.table(DATABASE_TABLE).select("*").eq("arxiv_id", arxiv_id).execute()
    return bool(response.data)
    
def extract_arxiv_id(url):
    """Extract the arXiv ID from a URL."""
    match = re.search(r'arxiv.org/abs/(\d+\.\d+)', url)
    return match.group(1) if match else None

async def fetch_papers():
    """Fetch research papers from arXiv, generate summaries, and store them in Supabase."""
    
    # Fetch data from arXiv API
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(ARXIV_API_URL)
        except Exception as e:
            print("Error fetching data from arXiv:", e)
            return
    
    if response.status_code != 200:
        print("Error fetching data from arXiv:", response.text)
        return

    # Parse arXiv response (RSS/Atom feed format)
    feed = feedparser.parse(response.text)

    # Extract relevant information
    papers = []
    for entry in feed.entries:
        #print(entry)
        paper_arxiv_id = extract_arxiv_id(entry.link)
        if paper_exists(paper_arxiv_id):
            print(f"Paper {paper_arxiv_id} already exists in the database.")
            continue

        summary = await generate_summary(entry.summary)  # Generate AI summary
        
        print(f"New paper found: {paper_arxiv_id}", )

        paper_data = {
            "arxiv_id": paper_arxiv_id,
            "title": entry.title,
            "authors": ", ".join(author.name for author in entry.authors),
            "abstract": entry.summary,
            "summary": summary,  # Store AI-generated summary
            "category": entry.arxiv_primary_category["term"],  # Extract category
            "url": entry.link,
            "published_at": datetime.strptime(entry.published, "%Y-%m-%dT%H:%M:%SZ").isoformat()
        }
        papers.append(paper_data)

    if not papers:
        print("No new papers found.")
        return

    # Insert into Supabase
    response = supabase.table(DATABASE_TABLE).insert(papers).execute()

    if response.data:
        print(f"Inserted {len(response.data)} papers into Supabase with summaries!")
    else:
        print("Failed to insert papers:", response.error)

# Run the script
import asyncio
asyncio.run(fetch_papers())
