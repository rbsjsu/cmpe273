# Ecommerce Web Application using microservices architecture
This repository contains the backend code for the microservices we have created to build an Ecommerce web application. We have made use of the Eureka Service Registry to register all the services with the Discovery server. All the services sit behind the Zuul API gateway which will be responsible for load balancing and authentication of requests. For asynchronous interservice communication we have made use of Apache Kafka.

# Service Architecture
<img src="/docs/service_architecture.jpg" alt="Service Architecture Diagram"/>

# Use Case Diagram
<img src="/docs/UseCaseDiagram.jpg" alt="Use Case Diagram"/>

## Features
* Registration/Login
* Create and Edit User profile
* Search for products
* Filter Search results 
* Bookmark Products
* Add products to Cart
* Checkout from cart with multiple products
* Payment Gateway
* Track product delivery
* Provide rating and review for purchased products

## Tools and Technologies used
* Spring Boot
* Express JS
* Eureka Service Discovery
* Zuul API gateway
* Apache Kafka
* MongoDb
* MySQL
* Bootstrap

## Installation
For services created using Express JS use the below command to install the dependencies
```bash
npm install
```
To run the service use the command
```bash
npm start
```

To run the services created in Spring Boot download [Spring Tool Suite](https://spring.io/tools). Import the service directory in Spring Tool Suite and then run the service.
