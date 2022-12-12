package com.majorproject.userservicev1;

import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer>{
	public User findByEmailString(String emailString);
}