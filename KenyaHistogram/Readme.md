Must include in all calls.

This alone will return the 500 most recent entries in ACLED

https://api.acleddata.com/acled/read?terms=accept


Returns JSON of 500 most recent Riot & Protest events in Kenya (404)

https://api.acleddata.com/acled/read?terms=accept&iso=404&event_type=Protests&event_type=Riots

ACLED Data Columns
ISO: A numeric code for each individual country.
EVENT_ID_CNTY: An individual event identifier by number and country acronym.
EVENT_ID_NO_CNTY: An individual event numeric identifier.
EVENT_DATE: Recorded as Day / Month / Year.
YEAR: The year in which an event took place.
TIME_PRECISION: A numeric code indicating the level of certainty of the date coded for the event (1-3).
EVENT_TYPE: The type of event.
SUB_EVENT_TYPE: The type of sub-event.
ACTOR1: A named actor involved in the event.
ASSOC_ACTOR_1: The named actor associated with or identifying with ACTOR1 in one specific event.
INTER1: A numeric code indicating the type of ACTOR1.
ACTOR2: The named actor involved in the event. If a dyadic event, there will also be an
“Actor 1”.
ASSOC_ACTOR_2: The named actor associated with or identifying with ACTOR2 in one specific event.
INTER2: A numeric code indicating the type of ACTOR2.
INTERACTION: A numeric code indicating the interaction between types of ACTOR1 and ACTOR2. Coded as an interaction between actor types, and recorded as lowest joint number.
REGION: The region of the world where the event took place.
COUNTRY: The country in which the event took place.
ADMIN1: The largest sub-national administrative region in which the event took place.
 ADMIN2: The second largest sub-national administrative region in which the event took place.
ADMIN3: The third largest sub-national administrative region in which the event took place.
LOCATION: The location in which the event took place.
LATITUDE: The latitude of the location.
LONGITUDE: The longitude of the location.
GEO_PRECISION: A numeric code indicating the level of certainty of the location coded for the event.
SOURCE: The source(s) used to code the event.
SOURCE SCALE: The geographic scale of the sources used to code the event. NOTES: A short description of the event.
FATALITIES: Number or estimate of fatalities due to event. These are frequently different across reports.