#!/usr/bin/env bash

TIMEOUT=8000
LAYER_ID="sea_ice_nh.ice_conc"
VARIABLE_ID="ice_conc"
LAYER_TYPE="tiles"
VERSION="0.8.2"
LON_RES="2444"
LAT_RES="496"
ZOOM_LEVELS="0-3"
MIN_LON="-180"
MAX_LON="180"
MIN_LAT="16.62393"
MAX_LAT="90"
MIN="0"
MAX="100"
MACHINE_TYPE="N1_HIGHCPU_8"

if [ ! -f ./package.json ]; then
    echo "You have to be in the root folder of the project to run this script!"
    exit 1
fi

# --machine-type=$MACHINE_TYPE \
gcloud builds submit --config ./ci/cloudbuild-tiles-reproject.yaml \
  --timeout=$TIMEOUT \
  --substitutions _LAYER_ID=$LAYER_ID,_VARIABLE_ID=$VARIABLE_ID,_ZOOM_LEVELS=$ZOOM_LEVELS,_LAYER_TYPE=$LAYER_TYPE,_LON_RES=$LON_RES,_LAT_RES=$LAT_RES,_VERSION=$VERSION,_MIN=$MIN,_MAX=$MAX,_MIN_LON=$MIN_LON,_MAX_LON=$MAX_LON,_MIN_LAT=$MIN_LAT,_MAX_LAT=$MAX_LAT \
  .
