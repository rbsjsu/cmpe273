package com.apurva.orderservice;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.apurva.orderservice.kafka.OrderCancelEvent;


@RestController
public class OrderController {
	@Autowired
	private OrderRepository orderRepository;
	
	@Autowired 
	private JwtUtil jwtUtil;
	
	@Autowired
	private KafkaTemplate<String, OrderCancelEvent> orderCancelKafkaTemplate;
	
	
	public boolean canAccess(HttpServletRequest request, Integer userIdInteger) {
		String jwtString = request.getHeader("Authorization").substring(7);
		String emailString = jwtUtil.extractUsername(jwtString);
		Integer idInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		return idInteger.equals(userIdInteger);
	}
	
	public String getJwtToken(HttpServletRequest request) {
		Cookie cookies[] = request.getCookies();
		for(Cookie cookie: cookies) {
			if(cookie.getName().equals("authCookie")) {
				return cookie.getValue();
			}
		}
		
		return "";
	}
	
	@GetMapping("/order/{orderIdInteger}")
	public Order getOrderById(HttpServletRequest request, @PathVariable Integer orderIdInteger) throws Exception{
		Order order = orderRepository.findByOrderIdInteger(orderIdInteger);
		if(order == null) {
			throw new Exception("No such order id!");
		}
		else {
			String jwtString = getJwtToken(request);
			Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
			if(order.getUserIdInteger() != userIdInteger) {
				throw new Exception("Access denied to sensitive data!");
			}
			else {
				return order;
			}
		}
	}
	
	@PutMapping("/update/{orderIdInteger}")
	public String updateOrderById(HttpServletRequest request,@RequestBody Order order, @PathVariable Integer orderIdInteger) throws Exception{
		
		orderRepository.save(order);
		return "Order updated successfully!";
	}
	
	@GetMapping("/user/my-orders")
	public List<Order> getOrdersByUserId(HttpServletRequest request) throws Exception{
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		return orderRepository.findByUserIdInteger(userIdInteger);
	}
	
	@GetMapping("/seller/{sellerIdString}")
	public List<Order> getOrdersBySellerId(@PathVariable String sellerIdString) {
		return orderRepository.findBySellerId(sellerIdString);
	}
	
	
	@PostMapping("/create-order")
	public String createOrder(HttpServletRequest request, @RequestBody Order order) {
		order.setOrderStatus("PENDING");
		orderRepository.save(order);
		return "Order Confirmed!";
	}
	
	/**
	 * this request takes as parameter a receipt-id
	 * and it updates the order status of all the orders with that <receipt-id>
	 * to what is specified in the request parameter orderStatus
	 */
	
	@GetMapping("/receipt/{receiptId}")
	public ResponseEntity<Receipt> getProductsOfOrder(@PathVariable String receiptId) {
		List<Order> orders = orderRepository.findByReceiptIdString(receiptId);
		
		List<OrderItem> ls = new ArrayList<>();
		for(Order order: orders) {
			ls.add(new OrderItem(""+order.getProductIdInteger(),order.getQuantityBoughtInteger(),order.getBillAmountDouble()));
		}
		
		Receipt receipt = new Receipt();
		if(orders.size()<1) {
			return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
		}
		
		receipt.setOrderItems(ls);
		receipt.setUserId(""+orders.get(0).getUserIdInteger());
		receipt.setAddressId(""+orders.get(0).getAddressIdInteger());
		if(orders.get(0).getDateOfPurchaseDate()==null) {			
			receipt.setDateOfPurchase(new SimpleDateFormat("yyyy-MM-dd").format(new Date()));
			
		}
		else
		{receipt.setDateOfPurchase(""+orders.get(0).getDateOfPurchaseDate());}
		
		
		return new ResponseEntity<>(receipt,HttpStatus.OK);
	}
	
	@GetMapping("/update-order-status")
	public String updateOrderStatusByReceiptId(HttpServletRequest request, @RequestParam String receiptId, @RequestParam String orderStatus) throws Exception {
		List<Order> orders = orderRepository.findByReceiptIdString(receiptId);
		
		for(Order order : orders) {
			order.setOrderStatus(orderStatus);
			orderRepository.save(order);
		}
		
		return "Updated Order Status!";
	}
	
	@GetMapping("/secret/{orderId}")
	public Order getOrderForApi(@PathVariable Integer orderId) {
		return orderRepository.findByOrderIdInteger(orderId);
	}
	
	@GetMapping("/cancel/{orderId}")
	public String cancelOrderById(@PathVariable Integer orderId, HttpServletRequest request, HttpServletResponse response) throws Exception {
		Order order = orderRepository.findByOrderIdInteger(orderId);
		
		if(order == null) {
			//return 404 error on front-end
			return "No such order exists";
		}
		
		
		
		if(order.getOrderStatus().equalsIgnoreCase("CONFIRMED") || order.getOrderStatus().equalsIgnoreCase("PENDING")) {
			order.setOrderStatus("CANCELLED");
			orderRepository.save(order);
			OrderCancelEvent orderCancelEvent = new OrderCancelEvent();
			orderCancelEvent.setEventType("OrderCanceled");
			orderCancelEvent.setOrderId(Integer.toString(orderId));
			
			orderCancelKafkaTemplate.send("OrderFulfillmentStream", orderCancelEvent);
			response.sendRedirect("http://localhost:8081/api/user/my-orders");
			return "Order cancelled! And kafka Message Generated";
		}
		else {
			return "This order cannot be canceled";
		}
	}
	
//	@GetMapping("/testing/{eventType}")
//	public String testingEndpoint(@PathVariable String eventType) {
//			return kafkaTemplate.send("InventoryStream",new ReserveStockMessage(eventType)).toString();
//		
//	}
}
