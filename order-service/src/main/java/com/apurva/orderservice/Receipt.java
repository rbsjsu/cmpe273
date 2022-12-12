package com.apurva.orderservice;

import java.util.List;

public class Receipt {

	private String userId;
	private String addressId;
	private List<OrderItem> orderItems;
	private String dateOfPurchase;
	public Receipt(String userId, String addressId, List<OrderItem> orderItems, String dateOfPurchase) {
		super();
		this.userId = userId;
		this.addressId = addressId;
		this.orderItems = orderItems;
		this.dateOfPurchase = dateOfPurchase;
	}
	public Receipt() {
		super();
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getAddressId() {
		return addressId;
	}
	public void setAddressId(String addressId) {
		this.addressId = addressId;
	}
	public List<OrderItem> getOrderItems() {
		return orderItems;
	}
	public void setOrderItems(List<OrderItem> orderItems) {
		this.orderItems = orderItems;
	}
	public String getDateOfPurchase() {
		return dateOfPurchase;
	}
	public void setDateOfPurchase(String dateOfPurchase) {
		this.dateOfPurchase = dateOfPurchase;
	}
	
	
}
