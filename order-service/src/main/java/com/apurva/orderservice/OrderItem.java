package com.apurva.orderservice;

public class OrderItem {
	private String productId;
	private int quantity;
	private double price;
	public OrderItem(String productId, int quantity, double price) {
		super();
		this.productId = productId;
		this.quantity = quantity;
		this.price = price;
	}
	public OrderItem() {
		super();
	}
	public String getProductId() {
		return productId;
	}
	public void setProductId(String productId) {
		this.productId = productId;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		if(quantity>=0)
		this.quantity = quantity;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		if(price>0)
		this.price = price;
	}
	
	
}
