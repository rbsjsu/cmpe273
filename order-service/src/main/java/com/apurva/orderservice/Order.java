package com.apurva.orderservice;


import java.sql.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "Order_Table")
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer orderIdInteger;
	
	enum OrderStatus {
		PENDING, CONFIRMED, SHIPPPED, CANCELLED, DELIVERD
	}
	
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
	
	public Order() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public Order(Integer orderIdInteger, Integer userIdInteger, Integer productIdInteger,
			Integer addressIdInteger, Integer quantityBoughtInteger, Date dateOfPurchaseDate, Date dateOfDeliverDate,
			Double billAmountDouble, String receiptIdString, String sellerId, String orderStatus, String sizeString) {
		super();
		this.orderIdInteger = orderIdInteger;
		this.userIdInteger = userIdInteger;
		this.productIdInteger = productIdInteger;
		this.addressIdInteger = addressIdInteger;
		this.quantityBoughtInteger = quantityBoughtInteger;
		this.dateOfPurchaseDate = dateOfPurchaseDate;
		this.dateOfDeliverDate = dateOfDeliverDate;
		this.billAmountDouble = billAmountDouble;
		this.orderStatusString = orderStatus;
		this.receiptIdString = receiptIdString;
		this.sellerId = sellerId;
		this.sizeString = sizeString;
	}

	

	public String getProductTitle() {
		return productTitle;
	}

	public void setProductTitle(String productTitle) {
		this.productTitle = productTitle;
	}

	public String getImageLink() {
		return imageLink;
	}

	public void setImageLink(String imageLink) {
		this.imageLink = imageLink;
	}

	public String getSellerId() {
		return sellerId;
	}

	public void setSellerId(String sellerId) {
		this.sellerId = sellerId;
	}

	public String getReceiptIdString() {
		return receiptIdString;
	}

	public void setReceiptIdString(String receiptIdString) {
		this.receiptIdString = receiptIdString;
	}

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

	public String getOrderStatus() {
		return orderStatusString;
	}

	public void setOrderStatus(String orderStatusString) {
		this.orderStatusString = orderStatusString;
	}

	public String getSizeString() {
		return sizeString;
	}

	public void setSizeString(String sizeString) {
		this.sizeString = sizeString;
	}
}
