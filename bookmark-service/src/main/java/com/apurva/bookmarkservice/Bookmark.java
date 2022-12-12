package com.apurva.bookmarkservice;

import java.util.HashMap;
import java.util.HashSet;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Bookmark {
	@Id
	private String bookmarkIdString;
	private Integer userIdInteger;
	private HashSet<String> productIdSet;
	public String getBookmarkIdString() {
		return bookmarkIdString;
	}
	public void setBookmarkIdString(String bookmarkIdString) {
		this.bookmarkIdString = bookmarkIdString;
	}
	public Integer getUserIdInteger() {
		return userIdInteger;
	}
	public void setUserIdInteger(Integer userIdInteger) {
		this.userIdInteger = userIdInteger;
	}
	public HashSet<String> getProductIdSet() {
		return productIdSet;
	}
	public void setProductIdSet(HashSet<String> productIdSet) {
		this.productIdSet = productIdSet;
	}
	
	
}
