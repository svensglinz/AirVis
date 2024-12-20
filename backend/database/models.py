from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Listing(db.Model):
    __tablename__ = 'listings'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    neighbourhood_cleansed = db.Column(db.String)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    property_type = db.Column(db.String)
    room_type = db.Column(db.String)
    price = db.Column(db.Float)
    bedrooms = db.Column(db.Integer)
    bathrooms_text = db.Column(db.String)
    beds = db.Column(db.Integer)
    host_is_superhost = db.Column(db.String)
    review_scores_rating = db.Column(db.Float)

class Calendar(db.Model):
    __tablename__ = 'calendar'
    listing_id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String)
    available = db.Column(db.String)
    price = db.Column(db.Float)

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer)
    reviewer_name = db.Column(db.String)
    comments = db.Column(db.String)

class Neighborhood(db.Model):
    __tablename__ = 'neighborhoods'
    id = db.Column(db.Integer, primary_key=True)
    neighborhood = db.Column(db.String)
    neighborhood_group = db.Column(db.String)
