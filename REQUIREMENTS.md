# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index    `products/`       [GET]
- Show     `products/:id`    [GET]
- Create   `products/`       [POST] [token required]


#### Users
- Index     `users/`      [GET] [token required]
- Show      `users/:id`   [GET] [token required]
- Create    `users/`      [POST]

#### Orders
- Show          `orders/:user_id`       [GET] [token required]
- Create        `orders/`               [POST] [token required]
- add product   `orders/:id/products`   [POST] [token required]


## Data Shapes
#### Product
- id
- name
- price

```bash
Table: products (id:number[primary key], name:varchar, price:number)
```

#### User
- id
- firstName
- lastName
- password

```bash
Table: users (id:number[primary key], firstname:varchar, lastname:varchar, password:varchar)
```

#### Orders
- id
- user_id
- status of order (active or complete)

```bash
Table: orders (id:number[primary key],user_id:number[foreign key to users table], status:varchar)
```

#### OrderProducts
- id
- order_id
- product_id of each product in the order
- quantity of each product in the order

```bash
Table: order_products (id:number[primary key], order_id:number[foreign key to orders table],product_id:number[foreign key to products table], quantity:number)
```