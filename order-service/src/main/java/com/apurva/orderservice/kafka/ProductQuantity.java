package com.apurva.orderservice.kafka;

public class ProductQuantity {

	private String  productId;
	private int quantity;
	private String orderId;
	
	
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	public ProductQuantity() {
		
	}
	public ProductQuantity(String orderId,String productId, int quantity) {
		super();
		this.productId = productId;
		this.orderId = orderId;
		this.quantity = quantity;
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
		this.quantity = quantity;
	}
	
}
