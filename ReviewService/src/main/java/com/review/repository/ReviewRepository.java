package com.review.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.review.model.Review;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

	public Optional<Review> findById(String reviewId);
	public List<Review> findByProductCode(String productCode);
	public List<Review> findByUserId(String userId);
	public List<Review> findByOrderId(String orderId);
}
