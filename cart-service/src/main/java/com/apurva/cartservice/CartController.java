package com.apurva.cartservice;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.RandomStringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jackson.JsonObjectDeserializer;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;



@RestController
public class CartController {
	@Autowired
	private RestTemplate restTemplate;
	
	@Autowired
	private CartRepository cartRepository;
	
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
	
	@GetMapping("get-cart-size")
	public Integer getCartSize(HttpServletRequest request) throws Exception{
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		Cart cart = cartRepository.findByUserIdInteger(userIdInteger);
		if(cart == null) {
			return 0;
		}
		
		return cart.getProductMap().size();
	}
	
	@GetMapping("/get-cart")
	public List<Product> getProductsByUserId(HttpServletRequest request ) throws Exception{
		
		String jwtString = getJwtToken(request);
		
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		Cart cart = cartRepository.findByUserIdInteger(userIdInteger);
		List<Product> products = new ArrayList<>();
		if(cart == null) {
			cart = new Cart();
			cart.setUserIdInteger(userIdInteger);
			cart.setProductMap(new HashMap<String, Integer>());
			cartRepository.save(cart);
		}
		else {
			for(String productCompositeId: cart.getProductMap().keySet()) {
				String productId = productCompositeId.split("@")[0];
				String sizeString = productCompositeId.split("@")[1];
				/*
				Product[] tempProducts =restTemplate.getForObject("http://productcatalog/product?id=" + productId, Product[].class);
				tempProducts[0].setQuantityBought(cart.getProductMap().get(productCompositeId));
				tempProducts[0].setSizeString(sizeString);
				products.add(tempProducts[0]);
				*/
				System.out.println("productCode:" + productId);
				Product product = restTemplate.getForObject("http://inventoryservice/product/"+productId, Product.class);
				
				Integer quantityBought = cart.getProductMap().get(productCompositeId);
				
				Available available =  restTemplate.getForObject("http://inventoryservice/available?productCode=" + productId + "&size=" + sizeString +"&qty=" + quantityBought , Available.class);
				
				product.setAvailable(available.isAvailable());
				product.setQuantityBought(quantityBought);
				//product.setShortDescription(object.shortDescription);
				product.setSizeString(sizeString);
				//product.setTitle(object.title);
				products.add(product);
				
			}
		}
		return products;
	}
	
	
	/**
	 * Endpoint to add product to cart
	 * @param request
	 * @param productId
	 * @param sizeString
	 * @return
	 * @throws Exception
	 */
	@GetMapping("/add-to-cart/{productId}/{sizeString}")
	public String addProductById(HttpServletRequest request, @PathVariable String productId, @PathVariable String sizeString, HttpServletResponse response) throws Exception {
		
		
		
		String jwtString = getJwtToken(request);
		
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		Cart cart = cartRepository.findByUserIdInteger(userIdInteger);
		if(cart == null) {
			cart = new Cart();
			cart.setUserIdInteger(userIdInteger);
			cart.setProductMap(new HashMap<String, Integer>());
			cartRepository.save(cart);
		}
		
		//we will create different orders for different sizes of the same product
		productId = productId + "@" + sizeString;
		int prevQuantity = 0;
		if(cart.getProductMap().containsKey(productId)) {
			prevQuantity = cart.getProductMap().get(productId);
		}
		
		cart.getProductMap().put(productId, prevQuantity + 1);
		
		cartRepository.save(cart);
		
		
		
		response.sendRedirect("http://localhost:8081/api/user/my-cart?operation=added");
		return "Added product to cart";
	}
	
	/**
	 * Endpoint to reduce quantity of product from cart by 1
	 * @param request
	 * @param productId
	 * @return
	 * @throws Exception
	 */
	@GetMapping("/remove-one-from-cart/{productId}/{sizeString}")
	public String removeProductById(HttpServletRequest request , @PathVariable String productId, @PathVariable String sizeString, HttpServletResponse response) throws Exception{
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		Cart cart = cartRepository.findByUserIdInteger(userIdInteger);
		if(cart == null) {
			cart = new Cart();
			cart.setUserIdInteger(userIdInteger);
			cart.setProductMap(new HashMap<String, Integer>());
			cartRepository.save(cart);
		}
		
		productId = productId + "@" + sizeString;
		
		if(cart.getProductMap().containsKey(productId)) {
			cart.getProductMap().put(productId, cart.getProductMap().get(productId) - 1);
			if(cart.getProductMap().get(productId) == 0) {
				cart.getProductMap().remove(productId);
			}
			
			cartRepository.save(cart);
		}
		response.sendRedirect("http://localhost:8081/api/user/my-cart?operation=removeOne");
		return "Product Quantity reduced by 1";
	}
	
	/**
	 * Endpoint to remove all quantity of the product from cart
	 * @param request
	 * @param productId
	 * @return
	 * @throws Exception
	 */
	@GetMapping("/remove-all-from-cart/{productId}/{sizeString}")
	public String deleteProductById(HttpServletRequest request , @PathVariable String productId, @PathVariable String sizeString, HttpServletResponse response) throws Exception {
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		Cart cart = cartRepository.findByUserIdInteger(userIdInteger);
		if(cart == null) {
			cart = new Cart();
			cart.setUserIdInteger(userIdInteger);
			cart.setProductMap(new HashMap<String, Integer>());
			cartRepository.save(cart);
		}
		
		productId = productId + "@" + sizeString;
		
		cart.getProductMap().remove(productId);
		cartRepository.save(cart);
		response.sendRedirect("http://localhost:8081/api/user/my-cart?operation=removeAll");
		return "Product removed from cart";
	}
	
	
	/**
	 * This method requires a Request parameter ?addressId=<integer value>
	 * this address id has to be available in the address table
	 * and that address has to belong to the user
	 * we can make him pick the address using radio button by showing his available addresses
	 */
	
	@GetMapping("/checkout")
	public PaymentInfo checkooutCart(@RequestParam Integer addressId ,HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		System.out.println("THE CHECKOUT ENDPOINT IS CALLED");
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString)); 
		
		// declaring data for the request body
		String receiptIdString = RandomStringUtils.random(10, true, true);
		Double totalBillDouble = 0D;
		Double billAmountDouble;
		Integer addressIdInteger = addressId;
		Integer quantityBoughtInteger;
		Integer sellerIdInteger;
		Integer productIdInteger;
		String orderStatus;
		
		Date dateOfPurchaseDate;
		Date dateOfDeliveryDate;
		
		String sellerId;
		
		String sizeString;
		
		String imageLink;
		
		String productTitle;
		
		List<Product> productsPurchased = getProductsByUserId(request);
		
		Cart cart = cartRepository.findByUserIdInteger(userIdInteger);
		
		for(Product product : productsPurchased) {
			billAmountDouble = product.getPrice();
			quantityBoughtInteger = product.getQuantityBought();
			sellerId = product.getManufacturer().getSellerId();
			imageLink = product.getImgs()[0];
			productIdInteger = Integer.parseInt(product.getProductCode());
			dateOfPurchaseDate = DateUtils.truncate(new Date(), Calendar.DAY_OF_MONTH);
			dateOfDeliveryDate = DateUtils.truncate(new Date(), Calendar.DAY_OF_MONTH);
			sizeString = product.getSizeString();
			productTitle = product.getTitle();
			
			totalBillDouble += (billAmountDouble * quantityBoughtInteger);
			orderStatus = "PENDING";
			Map<String, Object> requestBodyMap = new HashMap<>();
			
			requestBodyMap.put("userIdInteger", userIdInteger);
			requestBodyMap.put("imageLink", imageLink);
			requestBodyMap.put("productIdInteger", productIdInteger);
			requestBodyMap.put("addressIdInteger", addressIdInteger);
			requestBodyMap.put("quantityBoughtInteger", quantityBoughtInteger);
			requestBodyMap.put("dateOfPurchaseDate", dateOfPurchaseDate);
			requestBodyMap.put("dateOfDeliverDate", dateOfDeliveryDate);
			requestBodyMap.put("billAmountDouble", billAmountDouble*quantityBoughtInteger);
			requestBodyMap.put("orderStatusString", orderStatus);
			requestBodyMap.put("receiptIdString", receiptIdString);
			requestBodyMap.put("sellerId", sellerId);
			requestBodyMap.put("sizeString", sizeString);
			requestBodyMap.put("productTitle", productTitle);
			
			HttpHeaders headers = new HttpHeaders();
			headers.set("Authorization", (String)request.getAttribute("Authorization"));
			
			HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBodyMap, headers);
			
			ResponseEntity<String> responseEntity = restTemplate.postForEntity("http://order-service/create-order", entity, String.class);
			
			if(responseEntity == null) {
				throw new Exception("Failed order creation");
			}
			
			//remove the product from cart manually
			//because calling the function will give redirect error
			
			String productIdString = product.getProductCode() + "@" + product.getSizeString();
			if(cart.getProductMap().containsKey(productIdString)) {
				System.out.println("REMOVED FROM CART:" + productIdString);
				cart.getProductMap().remove(productIdString);
			}
			
			
			//deleteProductById(request, product.getProductCode(), product.getSizeString(), response);
			
		}
		
		cartRepository.save(cart);
		
		HttpHeaders headers = new HttpHeaders();
		List<String> cookiesList = new ArrayList<>();
		cookiesList.add("authCookie="+jwtString);
		headers.put(HttpHeaders.COOKIE, cookiesList);
		HttpEntity entity = new HttpEntity(headers);
		
		ResponseEntity<User> responseEntity = restTemplate.exchange("http://user-service/user", HttpMethod.GET, entity ,User.class);
		User user = responseEntity.getBody();
		String billAmountString = String.format("%.2f", totalBillDouble);
		
		PaymentInfo paymentInfo = new PaymentInfo();
		paymentInfo.setEmailId(user.getEmailString());
		paymentInfo.setMobileNo(user.getPhoneNumberString());
		paymentInfo.setReceiptId(receiptIdString);
		paymentInfo.setTotalBill(billAmountString);
		paymentInfo.setUserId(userIdInteger.toString());
		
		return paymentInfo;
		//response.sendRedirect("http://localhost:8081/payment-service/payment?totalBill=" + billAmountString + "&receiptId=" + receiptIdString + "&emailId=" + user.getEmailString() + "&mobileNo=" + user.getPhoneNumberString() + "&userId=" + userIdInteger);
		
		//return "receiptId: " + receiptIdString + " totalBill:" + totalBillDouble;
		
	} 
	
	
	
}
