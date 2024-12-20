from sqlalchemy import create_engine
import pandas as pd
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(base_dir, 'airvis.db')

os.makedirs(os.path.dirname(db_path), exist_ok = True)

engine = create_engine(f'sqlite:///{db_path}')

try:
    with engine.connect() as connection:
        print('Database connection successful')
except Exception as e:
    print(f'Database connection failed: {e}')

listings_path = os.path.join(base_dir, 'data/listings.csv')
calendar_path = os.path.join(base_dir, 'data/calendar.csv')
reviews_path = os.path.join(base_dir, 'data/reviews.csv')
neighbourhoods_path = os.path.join(base_dir, 'data/neighbourhoods.csv')


listings = pd.read_csv(listings_path)
calendar = pd.read_csv(calendar_path)
reviews = pd.read_csv(reviews_path)
neighbourhoods = pd.read_csv(neighbourhoods_path)

listings['price'] = listings['price'].replace(r'[\$,]', '', regex=True).astype(float)
calendar['price'] = calendar['price'].replace(r'[\$,]', '', regex=True).astype(float)

listings.to_sql('listings', con=engine, if_exists='replace', index=False)
calendar.to_sql('calendar', con=engine, if_exists='replace', index=False)
reviews.to_sql('reviews', con=engine, if_exists='replace', index=False)
neighbourhoods.to_sql('neighbourhoods', con=engine, if_exists='replace', index=False)

print('Database successfully populated')