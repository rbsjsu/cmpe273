package com.apurva.recommenderservice;


import java.sql.Date;


public class Order {

private Integer orderIdInteger;
	
	
	private Integer userIdInteger;	//customer-id
	private Integer productIdInteger;
	private Integer addressIdInteger;
	private Integer quantityBoughtInteger;
	
	private Date dateOfPurchaseDate;
	private Date dateOfDeliverDate;
	
	private Double billAmountDouble;
	
	private String orderStatusString;
	
	private String receiptIdString;
	
	private String sellerId;
	
	private String sizeString;
	
	private String imageLink;
	
	private String productTitle;

	public Integer getOrderIdInteger() {
		return orderIdInteger;
	}

	public void setOrderIdInteger(Integer orderIdInteger) {
		this.orderIdInteger = orderIdInteger;
	}

	public Integer getUserIdInteger() {
		return userIdInteger;
	}

	public void setUserIdInteger(Integer userIdInteger) {
		this.userIdInteger = userIdInteger;
	}

	public Integer getProductIdInteger() {
		return productIdInteger;
	}

	public void setProductIdInteger(Integer productIdInteger) {
		this.productIdInteger = productIdInteger;
	}

	public Integer getAddressIdInteger() {
		return addressIdInteger;
	}

	public void setAddressIdInteger(Integer addressIdInteger) {
		this.addressIdInteger = addressIdInteger;
	}

	public Integer getQuantityBoughtInteger() {
		return quantityBoughtInteger;
	}

	public void setQuantityBoughtInteger(Integer quantityBoughtInteger) {
		this.quantityBoughtInteger = quantityBoughtInteger;
	}

	public Date getDateOfPurchaseDate() {
		return dateOfPurchaseDate;
	}

	public void setDateOfPurchaseDate(Date dateOfPurchaseDate) {
		this.dateOfPurchaseDate = dateOfPurchaseDate;
	}

	public Date getDateOfDeliverDate() {
		return dateOfDeliverDate;
	}

	public void setDateOfDeliverDate(Date dateOfDeliverDate) {
		this.dateOfDeliverDate = dateOfDeliverDate;
	}

	public Double getBillAmountDouble() {
		return billAmountDouble;
	}

	public void setBillAmountDouble(Double billAmountDouble) {
		this.billAmountDouble = billAmountDouble;
	}

	public String getOrderStatusString() {
		return orderStatusString;
	}

	public void setOrderStatusString(String orderStatusString) {
		this.orderStatusString = orderStatusString;
	}

	public String getReceiptIdString() {
		return receiptIdString;
	}

	public void setReceiptIdString(String receiptIdString) {
		this.receiptIdString = receiptIdString;
	}

	public String getSellerId() {
		return sellerId;
	}

	public void setSellerId(String sellerId) {
		this.sellerId = sellerId;
	}

	public String getSizeString() {
		return sizeString;
	}

	public void setSizeString(String sizeString) {
		this.sizeString = sizeString;
	}

	public String getImageLink() {
		return imageLink;
	}

	public void setImageLink(String imageLink) {
		this.imageLink = imageLink;
	}

	public String getProductTitle() {
		return productTitle;
	}

	public void setProductTitle(String productTitle) {
		this.productTitle = productTitle;
	}
	
	
	
	
}
