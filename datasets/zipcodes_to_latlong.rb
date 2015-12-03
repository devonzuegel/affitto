require 'csv'
require 'awesome_print'

MEDIAN_VALUES_FILE = 'Zip_MedianValuePerSqft_AllHomes.csv'
ZIP_LAT_LONG_FILE  = 'zipcode.csv'

def get_zip_to_latlong
  zip_i, lat_i, lng_i = nil, nil, nil
  zip_to_latlong      = {}

  CSV.foreach(ZIP_LAT_LONG_FILE) do |line|
    if zip_i == nil
      zip_i = line.index('zip')
      lat_i = line.index('latitude')
      lng_i = line.index('longitude')
    else
      zip, lat, lng = line[zip_i], line[lat_i], line[lng_i]
      zip_to_latlong[zip] = { lat: lat.to_f.round, lng: lng.to_f.round }
    end
  end

  zip_to_latlong
end

def get_median_home_values
  zip_i, price_i, sizerank_i = nil, nil, nil
  result = {}

  CSV.foreach(MEDIAN_VALUES_FILE) do |line|
    if zip_i == nil
      zip_i       = line.index('Zip Code')
      price_i     = line.index('Median_Price')
      sizerank_i  = line.index('SizeRank')
    else
      zip         = line[zip_i]
      price       = line[price_i]
      size_rank   = line[sizerank_i]
      result[zip] = { price: price, size_rank: size_rank }
    end
  end

  result
end

zip_to_latlong = get_zip_to_latlong
zip_to_prices  = get_median_home_values

results = [] #[%w(price, size_rank, latitude, longitude)]
CSV.open('_zip_data.csv', 'w') do |csv|
  zip_to_prices.each do |zip, values|
    next if zip_to_latlong[zip].nil? or values.values.nil?
    row = values.values + zip_to_latlong[zip].values
    csv << row
  end
end