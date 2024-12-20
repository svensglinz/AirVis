library(plumber)
library(RSQLite)
library(dplyr)
library(tidyr)
library(stringr)
library(DBI)
library(glue)
library(jsonlite)

# Add a CORS filter to allow cross-origin requests
#* @filter cors
pr <- Plumber$new()

# ALLOW CORS REQUESTS
pr$filter("cors", function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  # Handle preflight OPTIONS requests
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
  forward()
})

# Connect to SQLite database
db_path <- "./database/airvis.db"

# get price histogram data
pr$handle("GET", "/files/<neighbourhood>", function(req, res, neighbourhood) {
  conn <- dbConnect(SQLite(), dbname = db_path)
  on.exit(dbDisconnect(conn)) # Ensure the connection is closed

  neighbourhood <- str_replace(neighbourhood, "%20", " ")

  if (neighbourhood == "all") {
    query <- glue::glue("SELECT price, room_type from listings")
  } else {
    query <- glue::glue("SELECT price, room_type from listings where neighbourhood_group_cleansed = '{neighbourhood}'")
  }
  # Query the database
  result <- dbGetQuery(conn, query)

  result <- result |>
    drop_na()

  meanPrice <- round(mean(result$price, na.rm = TRUE), 0)
  medianPrice <- round(median(result$price, na.rm = TRUE), 0)

  top <- quantile(result$price , 0.95)
  bottom <- quantile(result$price, 0.05)

  result <- result |>
    filter(between(price, bottom, top))

  # Return the data as JSON

  vals <- hist(result$price, breaks = "FD", plot = FALSE)
  return(list(hist = tibble(breaks = vals$breaks[-c(1)], count = vals$counts), meanPrice = meanPrice, medianPrice = medianPrice))
})

pr$handle("GET", "/health", function() {
  list(status = "API is running")
})

# Endpoint to fetch short-term vs long-term rental data
pr$handle("GET", "/shortTermRentals/<neighbourhood>", function(req, res, neighbourhood) {

  neighbourhood <- str_replace(neighbourhood, "%20", " ")

  conn <- dbConnect(SQLite(), dbname = db_path)
  on.exit(dbDisconnect(conn))

  if (neighbourhood == "all") {
    query <- "SELECT minimum_nights FROM listings"
  } else {
    query <- glue::glue("SELECT minimum_nights FROM listings where neighbourhood_group_cleansed = '{neighbourhood}'")
  }

  rentals <- dbGetQuery(conn, query)

  rentals_grouped <- rentals %>%
    mutate(category = ifelse(minimum_nights <= 28, "short-term", "long-term")) %>%
    group_by(category) %>%
    summarize(count = n(), .groups = "drop")

  total_rentals <- sum(rentals_grouped$count)
  rentals_grouped <- rentals_grouped %>%
    mutate(percentage = (count / total_rentals) * 100)

  histogram_data <- rentals %>%
    filter(minimum_nights <= 35) %>%
    mutate(bin = cut(minimum_nights, breaks = c(0, 1, 2, 3, 4, 5, 7, 14, 21, 28, 35), right = FALSE)) %>%
    count(bin) %>%
    rename(count = n)

  return(list(
    summary = rentals_grouped,
    histogram = histogram_data
  ))
})


# get room listings summary
pr$handle("GET", "/chart2/<neighbourhood>", function(req, res, neighbourhood) {
  conn <- dbConnect(SQLite(), dbname = db_path)
  on.exit(dbDisconnect(conn)) # Ensure the connection is closed

  neighbourhood <- str_replace(neighbourhood, "%20", " ")


  if (neighbourhood == "all") {
    query <- glue::glue("SELECT room_type from listings")
  } else {
    query <- glue::glue("SELECT room_type from listings where neighbourhood_group_cleansed = '{neighbourhood}'")
  }

  # Query the database
  result <- dbGetQuery(conn, query)

  result <- result |>
    drop_na() |>
    group_by(room_type) |>
    summarize(count = n())

  return(result)
})

# get all unique neighbourhoods
pr$handle("GET", "/area", function(req, res) {
  conn <- dbConnect(SQLite(), dbname = db_path)
  on.exit(dbDisconnect(conn)) # Ensure the connection is closed

  # Query the database
  query <- paste0("SELECT neighbourhood, neighbourhood_group from neighbourhoods")
  result <- dbGetQuery(conn, query)

  result <- result |>
    mutate(num = str_extract(neighbourhood_group, "[0-9]+")) |>
    arrange(as.numeric(num)) |>
    pull(neighbourhood_group) |>
    unique()

  # Return the data as JSON
  return(c("all", result))
})

# get geoJSON information
pr$handle("GET", "/geojson", function(req, res) {
  geojson_data <- jsonlite::fromJSON("./database/inverted.geojson")
  res$setHeader("Content-Type", "application/json")

  return(geojson_data)
})

pr$handle("GET", "/geojsonNeighbourhood", function(req, res) {
  vals <- jsonlite::fromJSON("./database/neighbourhoods.geojson")
  return(vals)
})

# fetch all data for the map at oncef
pr$handle("GET", "/mapData", function(req, res) {
  conn <- dbConnect(SQLite(), dbname = db_path)
  on.exit(dbDisconnect(conn)) # Ensure the connection is closed

  # Build base query
  query <- "SELECT id, neighbourhood_group_cleansed, name, longitude, latitude, price, room_type, amenities, bedrooms, bathrooms, beds, review_scores_location, review_scores_rating, review_scores_value FROM listings"

  result <- dbGetQuery(conn, query)

  # filter result for anemities of interest and append columns
  result <- result |>
    drop_na(-c(contains("review"))) |>
    mutate(amenities = tolower(amenities)) |>
    mutate(
      hasPool = str_detect(amenities, "pool"),
      hasWifi = str_detect(amenities, "(wifi)|(internet)"),
      hasKitchen = str_detect(amenities, "kitchen"),
      hasFreeParking = str_detect(amenities, "free parking"),
      hasBreakfast = str_detect(amenities, "breakfast"),
      room_type = case_when(
        str_detect(tolower(room_type), "(entire)|(hotel)") ~ "entire",
        str_detect(tolower(room_type), "(shared)|(private)") ~ "room",
        .default = room_type
        )
    ) |>
    select(-amenities)

  return(result)
})

#download data
pr$handle("GET", "/downloadData", function(req, res) {

# Code to produce data from table
#  conn <- dbConnect(SQLite(), dbname = db_path)
#  on.exit(dbDisconnect(conn))
#
#  tables_query <- "SELECT name FROM sqlite_master WHERE type='table';"
#  tables <- dbGetQuery(conn, tables_query)$name
#
#  temp_dir <- tempdir()
#  zip_file <- tempfile(fileext = ".zip")
#
#  csv_files <- sapply(tables, function(table) {
#    query <- glue::glue("SELECT * FROM {table}")
#    data <- dbGetQuery(conn, query)
#    csv_path <- file.path(temp_dir, paste0(table, ".csv"))
#    write.csv(data, csv_path, row.names = FALSE)
#    csv_path
#  })
#
#  zip(zipfile = zip_file, files = csv_files, flags = "-j")

  res$setHeader("Content-Type", "application/zip")
  res$setHeader("Content-Disposition", "attachment; filename=\"data.zip\"")

  zip_file <- "./database/database_tables.zip"
  res$body <- readBin(zip_file, "raw", file.info(zip_file)$size)
  res
})

# listen on port 8000
pr$run(port = 8000, host = "0.0.0.0")
