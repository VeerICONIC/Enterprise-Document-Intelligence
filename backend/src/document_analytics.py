from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
import re

STOPWORDS = list(stopwords.words("english"))

def document_statistics(text: str):
    # Remove extra spaces
    cleaned = re.sub(r"\s+", " ", text)

    words = cleaned.split()

    word_count = len(words)

    reading_time = max(1, round(word_count / 200))  # ~200 words/min

    vectorizer = TfidfVectorizer(
        stop_words=STOPWORDS,
        max_features=5,
    )

    tfidf = vectorizer.fit_transform([cleaned])

    keywords = vectorizer.get_feature_names_out().tolist()

    return {
        "word_count": word_count,
        "reading_time": reading_time,
        "keywords": keywords,
    }