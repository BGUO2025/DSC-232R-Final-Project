# 232R-Project-Mileston2

LINK TO THIS DOCUMENT: https://docs.google.com/document/d/1hr2qAm_SxXNxnPS_RZpy2czIRufkDrJxkSl5dx900WE/edit?usp=sharing
(README.MD files do not convert images. Here is the link to our original documentation page)
GitHub Repository Setup (2 points)
GitHub ID: BGUO2025
Create a GitHub Repository (Public or Private—it will need to be Public for final submission) and add your group members as collaborators
https://github.com/BGUO2025/DSC-232R-Final-Project
TODO: Laura Ngo Pooja Panchal please add yourselves to the repo
Provide a link to your dataset in your README.md: 
LINK to the Amazon Customer Reviews dataset
https://www.kaggle.com/datasets/cynthiarempel/amazon-us-customer-reviews-dataset?select=amazon_reviews_us_Sports_v1_00.tsv
SDSC Expanse Environment Setup (2 points)
Document your SDSC Expanse setup in your README.md (SEE BELOW)
Include your SparkSession configuration with justification for your memory/executor settings (SEE BELOW)
Use the formula: Executor instances = Total Cores - 1 and Executor memory = (Total Memory - Driver Memory) / Executor Instances
Executor instances = 32 − 1 = 31
Executor memory = (128 − 2) / 31 ≈ 4.06GB → 4GB per executor
JUSTIFICATION: We requested 32 cores and 128gb of memory meaning ~4gb per executor for our Expanse node. The execution size was the driving factor for this set. 
The execution size was the driving factor for this set based on previous experience working with social media analysis. Given the 54GB size of the Amazon dataset, this configuration provides:
High parallelism (31 concurrent tasks)


Sufficient executor memory to reduce shuffle spill


Balanced memory distribution to prevent executor OOM during aggregations
The 4GB executor size was chosen to provide adequate memory headroom for groupBy and aggregation operations without creating excessively large JVM heaps, which can increase garbage collection overhead.
Include a screenshot of your Spark UI showing multiple executors active during data loading 

CHECK!
Data Exploration using Spark (4 points)
 All data exploration must be done using Spark DataFrames, not Pandas. Use operations like:


df.count(), df.describe().show(), df.printSchema()
df.count()

102,899,354… Well we definitely have a lot of data!
df.describe.show() → Cut in parts for viewing


df.printSchema()

df.groupBy().agg() for aggregations
df.select().distinct().count() for unique values


Answer the following:
How many observations does your dataset have? - We have a total of 102,899,354 individual values before proper data cleaning. 

Describe all columns in your dataset: their scales and data distributions. Describe categorical and continuous variables. Describe your target column. 
Status
Columns
Type/Description
Justification/impact
✅
marketplace
Type: Categorical 
Description: Indicates country marketplace where review was written; we restrict to U.S marketplace for column unison
Scale: 2-letter country code 
Distribution: Discrete categories; restrict U.S for English-Language consistency 
We limit the dataset to English reviews to ensure interpretability and consistent text encoding; this won’t add predictive value and can be dropped after filtering


❌
customer_id
Type: Categorical 
Description: Unique identifier for each customer; high cardinality and lack of generalizable predictive structure 
Scale: Random alphanumeric identifier 
Distribution: Many unique values 
Not necessary for prediction, but could theoretically allow aggregation of user behavior if we find users with high/low interest in relation to the number of reviews
❌
review_id
Type: Categorical 
Description: Unique identifier for each review; only serves as key 
Scale: Unique per ID of review 
Distribution: Many unique values 
No predictive value and can be removed 
✅
product_id
Type: Categorical 
Description: Identifies a specific product; ratings may cluster by product but involves high cardinality
Scale: Identifier for a specific product 
Distribution: Many unique values 


Important for grouping reviews by product given there exists multilingual dataset for reviews of the same product in various countries. Enables aggregation to help detect product-specific rating tendancies
✅/❌
product_parent
Type: Categorical 
Scale: Parent-level product identifier 
Distribution: Fewer unique values than product_id but groups similar products 


Random identifier that can be used to aggregate reviews for the same product
Not strictly necessary as aggregation can be done using product_id. It can aggregate reviews to improve computational efficiency when grouping similar product variations



✅
product_title
Type: Categorical 
Description: Title of the product 
Scale: Free-text string 
Distribution: High-cardinality text feature 
Relatively helpful for sanity-checking product_id mappings and can be tokenized for NLP feature extraction if needed 
✅
product_category
Type: Categorical
Description: Broad umbrella term of product and can be used to group reviews
Scale: Broad product grouping 
Distribution: Discrete categories with likely uneven distribution depending on dataset composition 
Useful for one-hot-encoding. Difference categories may have varying rating distributions. 
✅✅✅–
star_rating
Type: Ordinal 
Description:
Scale: Integer values 1-5
Distribution: Typical skewed to higher ratings (4-5 stars) 
TARGET COLUMN

This is the variable we aim to predict using text features, vote counts, and metadata; ranking matters but intervals between rankings may not be perfectly equal/aligned
✅
helpful_votes
Type: Continuous 
Description: 
Scale: Integer ≥ 0 
Distribution: Right-skewed; most reviews receive few votes
Indicates perceived usefulness and can be combined with total_votes to create a helpfulness ratio
✅
total_votes
Type: Continuous 
Description:
Scale Integer ≥ 0
Distribution: Right-skewed
see above– the amount of votes that this review got i.e. combined we can get a new column to get a range of if the vote helped. Measure overall engagement such as helpfulness ratio = helpful_votes / total_votes 
❌❌❌
vine
Type: Categorical 
Description: Review was written as part of the Vine program (Y/N – binary)
Scale: Nominal 
Vine as a platform ended, though Amazon Vine reviews still exist in datasets; could indicate incentivized reviews but isn’t essential for analysis 
✅
verified_purchase
Type: Categorical 
Description: The review is on a verified purchase (Y/N – binary)
Scale: Nominal 
Distribution: Likely majority “Y”
May affect credibility and rating distribution; verified reviews may correlated with stronger sentiment 
✅
review_headline
Type: Text 
Description: The title of the review
Scale: Free-text
Distribution: Variable length; short phrases 
Useful for NLP processing as headlines often contain strong sentiment signals 
✅
review_body
Type: Text 
Description: text of review 
Scale: Free-text string 
Distribution: Highly variable length 
Primary feature source to use for planned transformations such as tokenization, sentiment analysis, vocab frequency, and reviewing length feature 
✅
review_date
Text: Temporal
Description: The date the review was written
Scale: Calendar date 
Distribution: Time-series across months/years 
Can enable seasonality analysis (e.g., December holiday spikes), trend analysis over time can be transformed into month, year, or holiday-period indicator values 


Categorical: marketplace, customer_id, review_id, product_id, product_parent, product_category, vine, verified_purchase 
Continuous/Numeric: helpful_votes, total_votes 
Ordinal Target Variable: star_rating 
Text: product_title, review_headline, review_body 
Temporal: review_date 
Do you have missing and duplicate values in your dataset?
YES: This is not a bad thing but note, for the sports, that a staggering 98% of the data doesn’t have a review_body nor review_headline. If we did remove all of that data, we’d be left with 77,888 just for that category alone. This may or may not make our lives difficult, but considering the myriad of data, we’ll most likely be able to compile a dictionary for sentiment analysis of good key words.
For image data: describe number of classes, image sizes, uniformity, cropping/normalization needs.
N/A– We aren’t working with any image related works.


Data Plots (4 points)
Create visualizations using Spark aggregations + matplotlib/plotly (sample data for plotting if needed)
Plot your data with various chart types: bar charts, histograms, scatter plots, etc.
Clearly explain each plot and what insights it provides


For image data: plot example classes
N/A not applicable because we aren’t working with image data


Preprocessing Plan (3 points)
 Describe how you will preprocess your data. Only explain—do not perform preprocessing (that is for MS3).


How will you handle missing values?
Due to the nature of our data, we’re going to have to ignore data that has no review_body and anything whose market_place is not US. We have these filtered out as a review_body is the bulk of our analysis in predicting a good review. We also need to stick to the US as we don’t have reasonable methods to grade a review from a different market or language.
How will you handle data imbalance (if applicable)?
This may potentially occur due to spatial handling of our data. Note that the Video_DVD category is sized to be 3.71GB whereas the smallest grouping is the Gift_Card at 39.98MB> That’s a stark contrast to in size and speed. We need to consider the first line of defense is knowing how to avoid a shuffle as that’s a free option at our disposal. Assuming our work in MS2 goes well without much of a hitch, then we should be OK with our initial set-ups. 
What transformations will you apply (scaling, encoding, feature engineering)?
Some of the transformations and features will be as follows:
helpful_votes / total_votes == helpfulness_ratio
A higher ratio means that the review was mostly good
This could correlate to verified purchases, so maybe that’s another avenue to play with as to whether a review ratio is likely verified or not
WARNING! Protect against division by 0
I.e when(total_votes > 0, helpful_votes / total_votes).otherwise(0)
Product_category → this on-hot encoding
Numeric product category for ML work
review_body → get length of review
General truth: longer reviews are a good thing. We can use the length as a feature we engineer
Eventually and generically the ML practices would be to have some features/ feature vector, put it through the ML machine, then receive a star_rating based on those features.

What Spark operations will you use for preprocessing?
FILTER: if it wasn’t obvious above, we are definitely filtering a lot of the data. Due to the particular needs we have, a review_body and a star_rating are the most necessary inputs (to our knowledge) 
select() filter() withColumn()
df = df.filter((F.col('marketplace') == 'US') & F.col('star_rating').isNotNull()
It’s still important to write and note our thoughts: AVOID SHUFFLING. 
dropna() – use to drop missing data/duplicate handling
fillna() – in the event we need to make a 0 for the helpfulness_ratio
lower() for the  text, length() for length, withColumn() may also help.

Link to Jupyter notebook for README.md:: https://github.com/BGUO2025/DSC-232R-Final-Project/blob/main/README.md
