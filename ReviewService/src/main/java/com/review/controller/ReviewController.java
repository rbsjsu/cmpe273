package com.review.controller;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.review.model.NewReview;
import com.review.model.Order;
import com.review.model.Order;
import com.review.model.Review;
import com.review.repository.ReviewRepository;
import com.review.resources.ReviewResource;

@CrossOrigin(origins = "*")
@RestController
public class ReviewController {

	
	@Autowired
	private ReviewResource res;
	
	public String getJwtToken(HttpServletRequest request) {
		Cookie cookies[] = request.getCookies();
		for(Cookie cookie: cookies) {
			if(cookie.getName().equals("authCookie")) {
				return cookie.getValue();
			}
		}
		
		return "";
	}
	
	@RequestMapping(value="/review", method=RequestMethod.GET)
	public Optional<Review> getByReviewId(@RequestParam("id") String reviewId) {
		return res.getByReviewId(reviewId);
	}
	
	@RequestMapping(value="/review/delete", method=RequestMethod.GET)
	public void deleteReview(@RequestParam("id") String reviewId) {
		 res.deleteByReviewId(reviewId);
	}
	
	@RequestMapping(value="/review/product/{productId}", method=RequestMethod.GET)
	public List<Review> getByProductCode(@PathVariable("productId") String productId) {
		return res.getByProductCode(productId);
	}
	
	
	@RequestMapping(value="/add/review", method=RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<Object> addReview(@RequestBody NewReview body, HttpServletRequest request ) {
		
		return res.addReview(body, body.getJwtString());
		
	}
	
	@RequestMapping(value="/review/user", method=RequestMethod.GET)
	public List<Review> getByUserId(@RequestParam("id") String userId) {
		return res.getByUserId(userId);
	}
	
	@RequestMapping(value="/review/order", method=RequestMethod.GET)
	public Review getByOrderId(@RequestParam("id") String orderId) {
		return res.getByOrderId(orderId);
	}
	
//	@CrossOrigin(origins = "*")
//	@RequestMapping(value="/test", method=RequestMethod.POST)
//	public Object testMethod(@RequestBody NewReview body,  HttpServletRequest request) {
//		System.out.println("here");
//		String jwtString = getJwtToken(request);
//		return body;
//	}
	
}
