package com.review.model;



import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(value="reviews")
public class Review {
	
	
	@Id
	private String id;
	private String productCode;
	private String name;
	private String reviewText;
	private int rating;
	private String userId;
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	private String orderId;
	
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Review() {}

	public Review(String productCode, String name, String reviewText, int rating, String orderId) {
		super();
		this.productCode = productCode;
		this.name = name;
		this.reviewText = reviewText;
		this.rating = rating;
		this.orderId=orderId;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProductCode() {
		return productCode;
	}

	public void setProductCode(String productCode) {
		this.productCode = productCode;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getReviewText() {
		return reviewText;
	}

	public void setReviewText(String reviewText) {
		this.reviewText = reviewText;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}
	
	
//	public List<String> getImageUris() {
//		return imageUris;
//	}
//	public void setImageUris(List<String> imageUris) {
//		this.imageUris = imageUris;
//	}
	
	
	
	

}
