from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Paper(Base):
    __tablename__ = "papers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    authors = Column(Text, nullable=False)
    abstract = Column(Text, nullable=False)
    summary = Column(Text, nullable=True)  # AI-generated summary
    url = Column(String, nullable=False)
    published_at = Column(DateTime, nullable=False)
