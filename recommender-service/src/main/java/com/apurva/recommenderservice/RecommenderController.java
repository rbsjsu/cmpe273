package com.apurva.recommenderservice;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;


@RestController
@RequestMapping
public class RecommenderController {
	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	public String getJwtToken(HttpServletRequest request) {
		Cookie cookies[] = request.getCookies();
		for(Cookie cookie: cookies) {
			if(cookie.getName().equals("authCookie")) {
				return cookie.getValue();
			}
		}
		
		return "";
	}
	
	@GetMapping("/recommend")
	public List<Product> recommendById(HttpServletRequest request, HttpServletResponse response) {
		
		String jwtString = getJwtToken(request);
		
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		List<Product> products = new ArrayList<>();
		
		
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", request.getHeader("Authorization"));
		List<String> cookiesList = new ArrayList<>();
		cookiesList.add("authCookie="+jwtString);
		headers.put(HttpHeaders.COOKIE, cookiesList);
		
		HttpEntity entity = new HttpEntity(headers);
		ResponseEntity<Order[]> responseEntity = restTemplate.exchange("http://order-service/user/my-orders", HttpMethod.GET, entity ,Order[].class);
		Order[] orders = responseEntity.getBody();
		//System.out.println("NUMBER OF ORDERS RETREIVED:" + orders.length);
		
		HashSet<String> set = new HashSet<>();
		
		for(Order order: orders) {
			System.out.println("ORDER ID:" + order.getOrderIdInteger());
			String productId = order.getProductIdInteger().toString();
			List<Product> products2 = getProductsById(request, productId);
			
			//only keeping unique products in the recommendation list
			for(Product product: products2) {
				if(!set.contains(product.getProductCode())) {
					set.add(product.getProductCode());
					products.add(product);
				}
			}
		}
		
		
		return products;
	}
	
	@GetMapping("/orders")
	public List<Order> getOrdersById(HttpServletRequest request) {
		
		String jwtString = getJwtToken(request);
		
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		List<Order> orders = new ArrayList<>();
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", request.getHeader("Authorization"));
		List<String> cookiesList = new ArrayList<>();
		cookiesList.add("authCookie="+jwtString);
		headers.put(HttpHeaders.COOKIE, cookiesList);
		
		HttpEntity entity = new HttpEntity(headers);
		ResponseEntity<Order[]> responseEntity = restTemplate.exchange("http://order-service/user/my-orders" , HttpMethod.GET, entity ,Order[].class);
		Order[] ordersArray = responseEntity.getBody();
		
		for(Order order: ordersArray) {
			orders.add(order);
		}
		
		return orders;
	}
	
	@GetMapping("/simproducts/{productId}")
	public List<Product> getProductsById(HttpServletRequest request, @PathVariable String productId) {
		
		String jwtString = getJwtToken(request);
		
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", request.getHeader("Authorization"));
		
		List<String> cookiesList = new ArrayList<>();
		cookiesList.add("authCookie="+jwtString);
		headers.put(HttpHeaders.COOKIE, cookiesList);
		
		HttpEntity entity = new HttpEntity(headers);
		
		List<Product> products = new ArrayList<>();
		
		ResponseEntity<Product[]> responseEntity = restTemplate.exchange("http://similarproducts/similar?id=" + productId , HttpMethod.GET, entity ,Product[].class);
		Product[] products2 = responseEntity.getBody();
		
		
		for(Product product:products2) {
			products.add(product);
		}
		return products;
	}
	
}
