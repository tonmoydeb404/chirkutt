# Chrikutt - share your thoughts

chirkutt is a kind of social media application. Users can interact with other users, share their thoughts as a post, get likes, comments, etc.

**live:** https://chirkutt.netlify.app

## Introduction

Chirkutt is my personal project. I have created this project to learn in-depth about Firebase. firebase is an easy backend solution provided by Google. In this project, I’ve used firebase firestore as a database and the authentication feature too.

## Features

1. Users can authenticate
2. Users can manage their posts
3. Users can like or comment on a post
4. Users will get notifications on likes and comments
5. Users can save posts
6. Users can manage their profile

## Challenges

1. **Creating notifications for both user**<br/>
   **description:** creating a single notification for a single user is easy. but when I tried to create a single notification for multiple users it was horrible. because I have to manage them too. like an example when a user replies to a comment I have to notify the post author and comment author too. and after that, if the comment author or post author deletes the comment then I have to delete both notifications. <br/>
   **solution:** to solve this I tried to create a data model where the notification id will be stored like something like this **[post id]:[author id]:[comment id]**. so now when I delete a post I will delete all the notifications that contain the post id in their id.
2. **Deleting user account**<br/>
   **description:** when a user wants to delete his account I have to remove all of his data from my database. but it will be a huge delete query for the firestore.<br/>
   **solution:** to avoid this I followed something like **Reddit**. I am not deleting anything from my database. just added a user property called **‘isDeleted’.** now deleted user posts will be shown but no one can access the deleted user profile or no one can share, like, or comment in deleted user posts.
