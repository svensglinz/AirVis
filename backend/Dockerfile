FROM rocker/tidyverse:latest as backend
RUN R -e "install.packages(c('plumber', 'RSQLite', 'jsonlite', 'glue', 'DBI', 'tidyr', 'dplyr', 'stringr'))"
WORKDIR /app
COPY ./backend.R .
COPY ./database ./database
CMD ["Rscript", "backend.R"]
EXPOSE 8000
