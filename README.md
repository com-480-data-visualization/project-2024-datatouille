# Project of Data Visualization (COM-480) - Datatouille

![datatouille](https://github.com/com-480-data-visualization/project-2024-datatouille/assets/62402657/2b603de7-855f-4689-8ff1-afd2411a275e)

| Student's name | SCIPER |
| -------------- | ------ |
|Nazlican Turan|315262|
|İlker Gül|353296|
|Berke Argin|376695|

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (29th March, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)), you could use also the DataSets proposed by the ENAC (see the Announcements section on Zulip).

We will mainly work with the [Michelin Guide Restaurants](https://www.kaggle.com/datasets/ngshiheng/michelin-guide-restaurants-2021) dataset, which is a CSV list of restaurants mentioned by the [Michelin Guide](https://guide.michelin.com/en). The dataset consists of **6794 rows**, each representing a unique Michelin-starred restaurant. This dataset encompasses **13 columns** which provide various details about the restaurants such as:

- `Name`
- `Address`
- `Location`
- `Price`
- `Cuisine`
- `Longitude`
- `Latitude`
- `PhoneNumber`
- `Url`
- `WebsiteUrl`
- `Award`   (Michelin star count and a special Bib Gourmand status)
- `FacilitiesAndServices`
- `Description` (taken from the Michelin Guide Website)

Since we are planning to visualize these restaurants on a interactive map, latitude and longitude are the most essential fields. We also plan to visualize the number of Michelin stars, as well as put contract information of the restaurants in our UI.

In addition, we also plan to expand this data with the [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview?hl=tr), which returns more detailed information such as opening hours, reviews, whether it serves wine/beer, has wheelchair support, and so on. We plan to visualize the opening hours on a calendar and use the extra flags (e.g. serves beer) for filtering purposes. Also, we plan to experiment with review word clouds to provide further insight to the restaurants.

For some of the restaurants in Europe, there are also some entries on the website [TheFork](https://www.thefork.com/). For those restaurants, we plan to utilize the [The Fork The Spoon API](https://rapidapi.com/apidojo/api/the-fork-the-spoon), which returns further information such as chef name, accepted currency, and menu data, a nested JSON list with meal descriptions (e.g. ingredients, chef commentary, and price). 

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

The most significant website for the users searching for Michelin Restaurants is [Guide Michelin](https://guide.michelin.com/en) which enables them to filter the restaurants based on their star ratings, price and cuisine preferances. [Via Michelin](https://www.viamichelin.com/web/Maps) is also allow users to view Michelin restaurants in a map. However, the website provides route planning services independent from Michelin-rated restaurants and offer basic filtering options based on star ratings and price which can be expanded much more. Our third inspiration is the platform [The Fork](https://www.thefork.com/) where users can search any restaurant, see their menus and filter according to their features but it's not including every Michelin Restaurants and is limited to European countries only.

Our main motivation to focus on Michelin Guide data, beyond our gourmet interests, stems from the noticeable lack of effective visualizations that engage audiences by filtering restaurants according to various features via an interactive map to display these filtered results in an engaging way, including closest Michelin restaurants to a selected location and routes that feature the selected restaurants world-wide. 

Our approach stands out in its originality with an extensive range of filtering options beyond just star rating and prices such as different dietary preferences (vegeterian, vegan, gluten free etc.), ambiance (pet friendly, wheelchair etc.), cuisine types and sustainability practices with a user friendly interface alongside an interactive map to present the filtered results with respect to selected locations. 

By combining the past approaches and providing a platform to visualize both the restaurants and locations in an easy to navigate fashion, our visualization aims to address the existing gap and to become a valuable resource for food enthusiasts seeking personalized dining experiences based on their specific preferences and selected destination.


## Milestone 2 (26th April, 5pm)

**10% of the final grade**


## Milestone 3 (31st May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

