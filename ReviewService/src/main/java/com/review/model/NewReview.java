package com.review.model;



public class NewReview {

	
	private String productCode;
	
	private String reviewText;
	private int rating;
	private String orderId;
	private String jwtString;
	//private List<String> imageUris;
	
	
	
	
	public String getJwtString() {
		return jwtString;
	}

	public void setJwtString(String jwtString) {
		this.jwtString = jwtString;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	@Override
	public String toString() {
		return "\nproductId : "+this.productCode+"\nRating : "+this.rating+"\nReviewText : "+this.reviewText;
	}
	
	public String getProductCode() {
		return productCode;
	}

	public void setProductCode(String productCode) {
		this.productCode = productCode;
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

	public boolean isValid() {
		if(this.productCode==null || this.rating<1 || this.rating>5)
		return false;
		else
			return true;
	}
}
