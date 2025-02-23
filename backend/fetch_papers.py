import httpx
import feedparser
from database import supabase  # Import the Supabase client
from datetime import datetime
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=OPENROUTER_API_KEY,
)

# Define the arXiv API URL (adjust query to your needs)
ARXIV_API_URL = "http://export.arxiv.org/api/query?search_query=cat:cs.AI&max_results=5&sortBy=submittedDate&sortOrder=descending"

async def generate_summary(abstract):
    """Generate a short summary of a research paper abstract using GPT-4."""
    try:
        response = client.chat.completions.create(
        model="mistralai/mistral-small-24b-instruct-2501:free",
        messages=[
                {"role": "system", "content": "Summarize this research paper abstract in 2-3 sentences."},
                {"role": "user", "content": abstract}
            ]
        )
        summary = response.choices[0].message.content.strip()
        return summary
    except Exception as e:
        print("Error generating summary:", e)
        return None  # If LLM fails, store None instead of breaking

async def fetch_papers():
    """Fetch research papers from arXiv, generate summaries, and store them in Supabase."""
    
    # Fetch data from arXiv API
    async with httpx.AsyncClient() as client:
        response = await client.get(ARXIV_API_URL)
    
    if response.status_code != 200:
        print("Error fetching data from arXiv:", response.text)
        return

    # Parse arXiv response (RSS/Atom feed format)
    feed = feedparser.parse(response.text)

    # Extract relevant information
    papers = []
    for entry in feed.entries:
        summary = await generate_summary(entry.summary)  # Generate AI summary

        paper_data = {
            "title": entry.title,
            "authors": ", ".join(author.name for author in entry.authors),
            "abstract": entry.summary,
            "summary": summary,  # Store AI-generated summary
            "url": entry.link,
            "published_at": datetime.strptime(entry.published, "%Y-%m-%dT%H:%M:%SZ").isoformat()
        }
        papers.append(paper_data)

    if not papers:
        print("No new papers found.")
        return

    # Insert into Supabase
    response = supabase.table("papers_test").insert(papers).execute()

    if response.data:
        print(f"Inserted {len(response.data)} papers into Supabase with summaries!")
    else:
        print("Failed to insert papers:", response.error)

# Run the script
import asyncio
asyncio.run(fetch_papers())
