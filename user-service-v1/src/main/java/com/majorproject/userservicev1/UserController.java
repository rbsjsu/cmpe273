package com.majorproject.userservicev1;

import java.util.Optional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping
public class UserController {
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private SellerRepository sellerRepository;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	
	
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
	
	@GetMapping("/user")
	public Optional<User> getUser(HttpServletRequest request) throws Exception{
		
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		return userRepository.findById(userIdInteger);
	}
	
	@PostMapping("/become-seller")
	public String becomeSeller(HttpServletRequest request, @ModelAttribute BecomeSellerRequest becomeSellerRequest, Model model, HttpServletResponse response ) throws Exception{
		
		model.addAttribute("becomeSellerRequest", becomeSellerRequest);
		
		String jwtString = getJwtToken(request);
		Integer userIdInteger = Integer.parseInt(jwtUtil.getPayload(jwtString));
		
		String emailString = jwtUtil.extractUsername(jwtString);
		User user = userRepository.findByEmailString(emailString);
		if(user.getRole().equals("seller")) {
			return "redirect:http://localhost:8081/api/user/become-seller";
		}
		user.setRole("seller");
		userRepository.save(user);
		
		Seller seller = new Seller();
		seller.setCompanyNameString(becomeSellerRequest.getCompanyNameString());
		seller.setUser(user);
		sellerRepository.save(seller);
		
		response.sendRedirect("http://localhost:8081/api/user/become-seller?seller=became");
		return "redirect:http://localhost:8081/api/user/become-seller?seller=bacame";
	}
	
	@GetMapping("/temp/{userId}")
	public Optional<User> tempFunction(@PathVariable Integer userId) {
		return userRepository.findById(userId);
	}

	@GetMapping("/seller/{userId}")
	public Seller getSellerById(@PathVariable Integer userId, HttpServletRequest request) {
		return sellerRepository.findByUserUserIdInteger(userId);
	}
	
}
