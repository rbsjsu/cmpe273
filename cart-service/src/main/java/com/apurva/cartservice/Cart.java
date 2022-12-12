package com.apurva.cartservice;

import java.util.HashMap;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Cart {
	
	@Id
	private String cartIdString;
	private Integer userIdInteger;
	private HashMap<String, Integer> productMap;
	
	public HashMap<String, Integer> getProductMap() {
		return productMap;
	}
	public void setProductMap(HashMap<String, Integer> productMap) {
		this.productMap = productMap;
	}
	public String getCartIdString() {
		return cartIdString;
	}
	public void setCartIdString(String cartIdString) {
		this.cartIdString = cartIdString;
	}
	public Integer getUserIdInteger() {
		return userIdInteger;
	}
	public void setUserIdInteger(Integer userIdInteger) {
		this.userIdInteger = userIdInteger;
	}
	
}
