1. Create a MongoDB database with following collections:
   a. Users
   b. Posts
   c. Categories
   d. Comments
2. Create following APIs:
   a. User signup with email account verification
   b. Authenticate users using their email and password.
   c. Retrieve the profile details of the logged-in user, including their bio and profile picture.
   d. Allow users to edit their profile information, including uploading a new profile picture.
   e. Add a new blog category with a name and description.
   f. Create a new blog post with a title, content, category, and tags. The author should be automatically linked to the post.
   g. List all categories along with the total number of posts in each category and the posts for that category.
   h. Allow the author to edit their blog post, including updating the title, content, category, and tags.
   i. Delete a blog post from the database.
   j. Retrieve a list of blog posts sorted by the number of likes.

Note: Use a MongoDB aggregation query with the pipeline feature. Don’t use any populate or any raw JS query for fetching data from MongoDB.
