package com.review.resources;


import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.review.model.NewReview;
import com.review.model.Order;
import com.review.model.Review;
import com.review.repository.ReviewRepository;

@Service
public class ReviewResource {

	@Autowired
	private ReviewRepository repo;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private RestTemplate restTemplate;
	
	public Optional<Review> getByReviewId( String reviewId) {
		return repo.findById(reviewId);
	}
	public void deleteByReviewId( String reviewId) {
		 repo.deleteById(reviewId);
		 
	}
	
	public List<Review> getByProductCode(String productCode) {
		return  repo.findByProductCode(productCode);
	}
	
	public List<Review> getByUserId(String userId) {
		return  repo.findByUserId(userId);
	}
	
	public Review getByOrderId(String orderId) {
		List<Review> data = repo.findByOrderId(orderId);
		if(data.size()>0)
			return data.get(0);
		else
			return null;
	}
	
	
	public ResponseEntity<Object> addReview(NewReview body, String jwtString) {
		try {
			
			
			if(body.isValid()) {
				
				Order order=restTemplate.getForObject("http://order-service/secret/"+ body.getOrderId(), Order.class);
				
				
				
				if(order==null || !(""+order.getUserIdInteger()).equals(jwtUtil.getPayload(jwtString)) || !body.getProductCode().equals(""+order.getProductIdInteger())) {
					throw new Exception("Product is Not Ordered By the User !!!");
				}
				
				String reviewerName = jwtUtil.getFullName(jwtString);
				Review nReview = new Review();
				
				nReview.setProductCode(body.getProductCode());
				nReview.setRating(body.getRating());
				nReview.setName(reviewerName);
				nReview.setReviewText(body.getReviewText());
				nReview.setOrderId(body.getOrderId());
				nReview.setUserId(""+order.getUserIdInteger());
//				add kafka of add review
				Object temp = repo.save(nReview);
				System.out.println("review Added!!!");
				return ResponseEntity.ok(temp);
			}else {
				throw new Exception("Request Body is not Valid !!!");
			}
		}catch(Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\":" + e.getMessage()+"}");
		}
		
	}
//
//	public Object testMethod(String orderId) {
//		
//		return restTemplate.getForObject("http://orderservice/user/"+ orderId, Object.class);
//	}
}
