package com.apurva.orderservice;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface OrderRepository extends CrudRepository<Order, Integer>{
	public List<Order> findByUserIdInteger(Integer userIdInteger);
	public List<Order> findBySellerId(String sellerId);
	public List<Order> findByProductIdInteger(Integer productIdInteger);
	public List<Order> findByReceiptIdString(String receiptIdString);
	public Order findByOrderIdInteger(Integer orderIdInteger);
	
}
