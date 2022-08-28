# book-record-management-10567

This is a book record management API Backend for the management of records and books

# API Documentation link

https://documenter.getpostman.com/view/22926215/VUr1GseH

# Routes and Endpoints

## /users

POST: Create a new user  //done
GET: Get all list of users //done

## /users/{id}

GET: Get a user by id //done
PUT: Update a user by id  //done
DELETE: Delete a user by id (check if he/she still has an issued book) (is there any fine to be paid) ✅

## /users/subscription-details/{id}

NOTE: Dates will be in the format mm/dd/yyyy

GET: Get user subscription details //done

1. Date of subscription
2. Valid till
3. Fine if any

## /books

GET: Get all books //done
POST: Create/Add a new book //done

## /books/{id}

GET: Get a book by id //done
PUT: Update a book by id //done

## /books/issued/by-users

GET: Get all issued books //done

## /books/issued/withFine

GET: Get all issued books with fine //done

# Subscription Types

Basic (3 months)
Standard (6 months)
Premium (12 months)

If the subscription date is 01/08/22
and Subscription type is Standard
the valid till date will be 01/02/23

If he has an issued book and the issued book is to be returned at 01/01/23
If he missed the date of return, then he gts a fine of Rs. 100./

If he has an issued book and the issued book is to be returned at 01/01/23
If he missed the date of return, and his subscription also expires, then he will get a fine of Rs 200./
