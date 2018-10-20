# Metadata Aggregator

Using [osm-qa-tiles](//osmlab.github.io/osm-qa-tiles/) and [tile-reduce](//github.com/mapbox/tile-reduce), this is a basic aggregation of OSM metadata (such as object tags)

It's like taginfo.openstreetmap.org, but matches on any key/value and shows where / when (to the best of it's ability)

## What Is Counted?
Because this uses osm-qa-tiles, an object is counted if the latest (most-recent) edit to a currently visible object contains the username of someone on the following lists. What is then not represented:

 - Edits to any previous version of an object
 - Deletions
 - Edits to nodes w/o tags (i.e. moving a node in a way and not editing the way itself)
 - Turn restrictions & relations with abstract geometry representations

To this end, this visualization is not an exact record of all editing activity, but a decent approximation of relative editing activity.

### Running

	npm install
	node index.js

This creates the following output files:

 <!-- - `summary-totals.csv`: Edits per day per tile that matched -->
 - `tileSummaries.geojsonseq`: Each GeoJSON object that matched a term

### Downscaling
The `Low-Zoom-Aggregation.ipynb` notebook reads in all of the tile summaries in tileSummaries.geojsonseq and creates lower zoom aggregations to fit all the data into vector tiles.

### Analysis
The Jupyter notebook, `Analysis.ipynb` reads in `summary-totals.csv` for plotting / analysis and creating the timelines required for the interactive map.

### Making the Map
The `docs` folder contains everything for the interactive heatmap. This is built on d3 and Mapbox-GL.

Running the script `run-tippecanoe.sh` will create an `mbtiles` file for visualizing the data.
