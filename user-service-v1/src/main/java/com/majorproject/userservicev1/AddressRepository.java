package com.majorproject.userservicev1;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface AddressRepository extends CrudRepository<Address, Integer> {
	public List<Address> findAddressByUserUserIdInteger(Integer userIdInteger);
	public Address findAddressByAddressIdInteger(Integer addressIdInteger);
}
