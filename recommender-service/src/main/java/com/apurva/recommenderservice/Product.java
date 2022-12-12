package com.apurva.recommenderservice;

import com.apurva.recommenderservice.Product.Manufacturer;;

public class Product {
	
	private String productCode;
	private String title;
	private String shortDescription;
	private Double price;
	private String sizeString;
	private String[] imgs;
	private Integer quantityBought;
	private Boolean available;
	private Manufacturer manufacturer;
	private Double avgRating;
	private Sizes sizes[];
	private Category category;
	private Double mrp;
	private Double offer;
	
	
	
	
	public Double getMrp() {
		return mrp;
	}
	public void setMrp(Double mrp) {
		this.mrp = mrp;
	}
	public Double getOffer() {
		return offer;
	}
	public void setOffer(Double offer) {
		this.offer = offer;
	}
	public Category getCategory() {
		return category;
	}
	public void setCategory(Category category) {
		this.category = category;
	}
	public Sizes[] getSizes() {
		return sizes;
	}
	public void setSizes(Sizes[] sizes) {
		this.sizes = sizes;
	}
	public Boolean getAvailable() {
		return available;
	}
	public void setAvailable(Boolean available) {
		this.available = available;
	}
	public Double getAvgRating() {
		return avgRating;
	}
	public void setAvgRating(Double avgRating) {
		this.avgRating = avgRating;
	}
	public Manufacturer getManufacturer() {
		return manufacturer;
	}
	public void setManufacturer(Manufacturer manufacturer) {
		this.manufacturer = manufacturer;
	}
	public String getProductCode() {
		return productCode;
	}
	public void setProductCode(String productCode) {
		this.productCode = productCode;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getShortDescription() {
		return shortDescription;
	}
	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public String getSizeString() {
		return sizeString;
	}
	public void setSizeString(String sizeString) {
		this.sizeString = sizeString;
	}
	public String[] getImgs() {
		return imgs;
	}
	public void setImgs(String[] imgs) {
		this.imgs = imgs;
	}
	public Integer getQuantityBought() {
		return quantityBought;
	}
	public void setQuantityBought(Integer quantityBought) {
		this.quantityBought = quantityBought;
	}
	
	
	static class Manufacturer{
		String sellerId;
		String companyName;
		public String getSellerId() {
			return sellerId;
		}
		public void setSellerId(String sellerId) {
			this.sellerId = sellerId;
		}
		public String getCompanyName() {
			return companyName;
		}
		public void setCompanyName(String companyName) {
			this.companyName = companyName;
		}
		
	}
	
	static class Sizes {
		private String _id;
		private String value;
		private Integer stock;
		public String get_id() {
			return _id;
		}
		public void set_id(String _id) {
			this._id = _id;
		}
		public String getValue() {
			return value;
		}
		public void setValue(String value) {
			this.value = value;
		}
		public Integer getStock() {
			return stock;
		}
		public void setStock(Integer stock) {
			this.stock = stock;
		}
	}
	
	static class Category{
		private String[] subcategories;
		private String _id;
		private String title;
		private String slug;
		private Integer __v;
		public String[] getSubcategories() {
			return subcategories;
		}
		public void setSubcategories(String[] subcategories) {
			this.subcategories = subcategories;
		}
		public String get_id() {
			return _id;
		}
		public void set_id(String _id) {
			this._id = _id;
		}
		public String getTitle() {
			return title;
		}
		public void setTitle(String title) {
			this.title = title;
		}
		public String getSlug() {
			return slug;
		}
		public void setSlug(String slug) {
			this.slug = slug;
		}
		public Integer get__v() {
			return __v;
		}
		public void set__v(Integer __v) {
			this.__v = __v;
		}
		
		
	}
	
	
	
}
