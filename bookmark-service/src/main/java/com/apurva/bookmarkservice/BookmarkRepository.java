package com.apurva.bookmarkservice;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookmarkRepository extends MongoRepository<Bookmark, String> {
	public Bookmark findByUserIdInteger(Integer userIdInteger);
}
