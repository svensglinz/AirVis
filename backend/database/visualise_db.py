from sqlalchemy_schemadisplay import create_schema_graph
from sqlalchemy import MetaData, create_engine

engine = create_engine('sqlite:///airvis.db')

metadata = MetaData()
metadata.reflect(bind=engine)

graph = create_schema_graph(
    metadata = metadata,
    engine = engine,
    show_datatypes = True,
    show_indexes = True,
    rankdir = 'TB',
    concentrate = False
)

graph.write_png('database_schema.png')