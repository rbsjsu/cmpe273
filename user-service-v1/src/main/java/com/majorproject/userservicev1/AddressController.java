package com.majorproject.userservicev1;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.majorproject.userservicev1.ListAddresses;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.ui.Model;

@RestController
@RequestMapping
public class AddressController {
	@Autowired
	private AddressRepository addressRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	/**
	 * The method returns whether a particular resource 
	 * can be accessed by the user or not
	 * @return
	 */
	public boolean canAccess(HttpServletRequest request, Integer userIdInteger) {
		String jwtString = request.getHeader("Authorization").substring(7);
		String emailString = jwtUtil.extractUsername(jwtString);
		Integer idInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		return idInteger.equals(userIdInteger);
	}
	
	/**
	 * Instead of canAccess now use cookies to implement access-control
	 * @param request
	 * @return
	 */
	public String getJwtToken(HttpServletRequest request) {
		Cookie cookies[] = request.getCookies();
		for(Cookie cookie: cookies) {
			if(cookie.getName().equals("authCookie")) {
				return cookie.getValue();
			}
		}
		
		return "";
	}
	
	/**
	 * Endpoint to get all Addresses of the user
	 * @param request
	 * @param userIdInteger
	 * @return
	 * @throws Exception
	 */
	@GetMapping("/addresses")
	public List<AddressResponse> getAddresses(HttpServletRequest request) throws Exception{
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		List<AddressResponse> addressResponses = new ArrayList<>();
		
		for(Address address : addressRepository.findAddressByUserUserIdInteger(userIdInteger)) {
			AddressResponse addressResponse = new AddressResponse();
			addressResponse.setAddressIdInteger(address.getAddressIdInteger());
			addressResponse.setCityNameString(address.getCityNameString());
			addressResponse.setFirstLineString(address.getFirstLineString());
			addressResponse.setSecondLineString(address.getSecondLineString());
			addressResponse.setThirdLineString(address.getThirdLineString());
			addressResponse.setPincodeString(address.getPincodeString());
			addressResponses.add(addressResponse);
		}
		
		return addressResponses;
	}
	
	/**
	 * Endpoint to add an address for the user
	 * @param request
	 * @param userIdInteger
	 * @param address
	 * @return
	 * @throws Exception
	 */
	@PostMapping("/addresses")
	public String addAddress(HttpServletRequest request , @ModelAttribute Address address, Model model, HttpServletResponse response) throws Exception{
		
		model.addAttribute("address", address);
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		address.setUser(new User(userIdInteger,"","","", "",""));
		addressRepository.save(address);
		response.sendRedirect("http://localhost:8081/api/user/my-addresses?address=added");
		return "Address saved";
	}
	
	/**
	 * Endpoint to update a specific address of the user
	 * @param request
	 * @param userIdInteger
	 * @param addressIdInteger
	 * @param address
	 * @return
	 */
	@PutMapping("/addresses/{addressIdInteger}")
	public String updateAddressById(HttpServletRequest request, @PathVariable Integer addressIdInteger, @RequestBody Address address) throws Exception{
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		address.setUser(new User(userIdInteger,"","","","", ""));
		address.setAddressIdInteger(addressIdInteger);
		addressRepository.save(address);
		return "Address updates successfully!";
	}
	
	/**
	 * Endpoint to delete a specific address
	 * @param request
	 * @param userIdInteger
	 * @param addressIdInteger
	 * @return
	 * @throws Exception
	 */
	@GetMapping("/addresses/{addressIdInteger}")
	public String deleteAddressById(HttpServletRequest request, @PathVariable Integer addressIdInteger, HttpServletResponse response) throws Exception {
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		addressRepository.deleteById(addressIdInteger);
		response.sendRedirect("http://localhost:8081/api/user/my-addresses?address=deleted");
		return "Address removed";
	}
	
	@GetMapping("/address/{addressId}")
	public Address getAddress(@PathVariable Integer addressId) {
		return addressRepository.findAddressByAddressIdInteger(addressId);
	}
}
