package com.apurva.orderservice.kafka;

import java.util.HashMap;
import java.util.List;

public class ReserveStockMessage {

	private String eventType;
	private List<ProductQuantity> products;
	public String getEventType() {
		return eventType;
	}
	public void setEventType(String eventType) {
		this.eventType = eventType;
	}
	public List<ProductQuantity> getProducts() {
		return products;
	}
	public void setProducts(List<ProductQuantity> products) {
		this.products = products;
	}
	
	
	
	
	
	
}
