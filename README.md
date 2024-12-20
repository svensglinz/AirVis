# AirBnBVis - An interactive visualization of Zurich's AirBnB rentals 

This website is currently hosted ![here](https://fp-p21.fwe24.ivia.ch/) 
## Description: 

Our project aims to give a quick overview over Zurich's AirBnB market. 
As a user, you will be able to display and filter properties 
according to different filters such as the neighbourhood, room type, price range, number of bed - or bathrooms 
and different types of amenities. 

Further, depending on the selected neighbourhood, summary statistics such as the distribution 
of all prices in the neighbourhood, information about the share of private rooms / entire homes and 
the distribution of properties by the minimum rental duration are dynamically displayed. 

If desired, the user can also download the entire data set. 

The website is optimized for Desktop and Mobile phones and slightly changes its layout and behavior depending on the viewport width. 

# Dependencies / Installation: 

Run this project locally by cloning the repository and running: (make sure to have docker installed)
```shell
docker-compose up
```

Your app will be running on `http://localhost:5173`

ℹ️ **Info:** The base image rocker/tidyverse:latest is only available for AMD64 architecture. If you want to
run this on ARM based architectures, replace the first line of `backend/Dockerfile` with

```text
FROM r-base as backend
```
As packages that are preinstalled in /rocker/tidyverse have to be installed and compiled from source, this setup could take quite a while.

---
On linux, if you would like to build the project without docker, you will need: 

- R interpreter (> 4.0)
  - Dependencies: 
    - plumber, RSQLite, jsonlite, glue, DBI, tidyr, dplyr, stringr
- node.js (tested with 18.19.1)

1. Build and run frontend: 
- Run `npm i` to install the project dependencies from `/frontend/`
- Run `VITE_BACKEND_URL=http://localhost:8000 npm run dev` from `/frontend/` to start the development server on port 5173 

2. Build and run backend:
- Run `RUN R -e "install.packages(c('plumber', 'RSQLite', 'jsonlite', 'glue', 'DBI', 'tidyr', 'dplyr', 'stringr'))`
to install the dependencies 
- Run `Rscript backend.R` from `/backend/` to start the backend on port 8000

## Impressions 

<div
  style="
    display: flex; 
    flex-wrap: wrap; 
    margin: auto; 
    align-items: center; 
    justify-content: center; 
    text-align: center;"
>
  <img src="/pictures/main_mobile.png/" alt="" width="200" style="margin: 10px 20px;">
  <img src="/pictures/overview_mobile.png" alt="" width="200" style="margin: 10px 20px;">
  <img src="/pictures/overview_laptop.png" alt="" style="margin: 10px 20px;" width="600">
</div>



