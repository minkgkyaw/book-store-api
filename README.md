# book-store-api

React သမားတွေအတွက် Backend API တစ်ခုနဲ့ချိတ်ဆက်အသုံးပြုနည်း လေ့ကျင့်ဖို့ အတွက် ရေးထားခြင်းဖြစ်ပါတယ်။

User avatar တွေ Book cover (images) အတွက် နောက်ထပ် cloudinary API နဲ့ ချိတ်ဆက်အသုံးပြုဖိုု့ လိုအပ်ပါတယ်။

<br>

___ 
## Main Endpoint 

> ***https://mkk-book-store.herokuapp.com/api/v1***

<br>

___

<br>

### For Users

> https://mkk-book-store.herokuapp.com/api/v1/users

<br>

#### Create new account/register
> https://mkk-book-store.herokuapp.com/api/v1/users/register

- Method => `POST`
- Required body => name, email, password 
- Optional body => avatar (*avatar should be URL*)

<br>

#### Login user

> https://mkk-book-store.herokuapp.com/api/v1/users/login

- Method => `POST`
- Required body => email, password 

<br>

#### Get my profile

> https://mkk-book-store.herokuapp.com/api/v1/users/profile

- Method => `GET`
- Require authorization header ***(Bearer token)***

<br>

#### Update my profile

> https://mkk-book-store.herokuapp.com/api/v1/users/profile

- Method => `PATCH`
- Require authorization header ***(Bearer token)***
- Optional body => name, email, password, avatar

<br>

#### Delete my profile

> https://mkk-book-store.herokuapp.com/api/v1/users/profile

- Method => `DELETE`
- Require authorization header ***(Bearer token)***

<br>

#### Get all users route

>https://mkk-book-store.herokuapp.com/api/v1/users

- Method => `GET`
- Optional pagination with query (`take` and `skip`)
- https://mkk-book-store.herokuapp.com/api/v1/users?take=50&skip=10
- Require authorization header ***(Bearer token)***

<br>

#### Get user by id

> https://mkk-book-store.herokuapp.com/api/v1/users/:id

- Method => `GET`
- Replace a user ID (mongo id) in `:id`
- Require authorization header ***(Bearer token)***

<br>

___

<br>

### For Books

> https://mkk-book-store.herokuapp.com/api/v1/books

***Books အတွက် endpoints အားလုံးဟာ authorization header (Bearer token) လိုအပ်မှာဖြစ်ပါတယ်***

<br>

#### Get all books

> https://mkk-book-store.herokuapp.com/api/v1/books

- Method => `GET`
- Optional pagination with query (`take` and `skip`)
- https://mkk-book-store.herokuapp.com/api/v1/books?take=50&skip=10
- Require authorization header ***(Bearer token)***

<br>

#### Get book by id

> https://mkk-book-store.herokuapp.com/api/v1/books/:id

- Method => `GET`
- Replace a book ID (mongo id) in `:id`
- Require authorization header ***(Bearer token)***

<br>

#### Create book 

> https://mkk-book-store.herokuapp.com/api/v1/books

- Method => `POST`
- Required body => title, author
- Optional body => description, price, cover (*cover should be URL*)
- Require authorization header ***(Bearer token)***

<br>

#### Update book 

> https://mkk-book-store.herokuapp.com/api/v1/books/:id

- Method => `PATCH`
- Replace a book ID (mongo id) in `:id`
- Optional body => title, author, description, price, cover (*cover should be URL*)
- Require authorization header ***(Bearer token)***

<br>

#### Delete book 

> https://mkk-book-store.herokuapp.com/api/v1/books/:id

- Method => `DELETE`
- Replace a book ID (mongo id) in `:id`
- Require authorization header ***(Bearer token)***

<br>

#### Get books by authors name 

> https://mkk-book-store.herokuapp.com/api/v1/books/by_authors

- Method => `PATCH`
- Request body => author
- Require authorization header ***(Bearer token)***

<br>

#### Get books by uploader id

> https://mkk-book-store.herokuapp.com/api/v1/books/by_authors

- Method => `PATCH`
- Request body => uploader (***Uploader should be User mongo ID***)
- Require authorization header ***(Bearer token)***

<br>


